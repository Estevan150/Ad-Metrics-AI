import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomatedReport {
  id: string;
  name: string;
  type: string;
  email_recipients: string[];
  schedule_day: number;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
}

export function AutomatedReports() {
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'weekly',
    email_recipients: [''],
    schedule_day: 1,
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('automated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar relatórios automáticos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    try {
      const { error } = await supabase
        .from('automated_reports')
        .insert({
          user_id: user?.id,
          name: formData.name,
          type: formData.type,
          email_recipients: formData.email_recipients.filter(email => email.trim() !== ''),
          schedule_day: formData.schedule_day,
          is_active: formData.is_active,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Relatório automático criado com sucesso",
      });

      setShowForm(false);
      setFormData({
        name: '',
        type: 'weekly',
        email_recipients: [''],
        schedule_day: 1,
        is_active: true,
      });
      fetchReports();
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar relatório automático",
        variant: "destructive",
      });
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automated_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Relatório automático removido",
      });

      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover relatório automático",
        variant: "destructive",
      });
    }
  };

  const toggleReport = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automated_reports')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setReports(prev => 
        prev.map(r => r.id === id ? { ...r, is_active: isActive } : r)
      );
    } catch (error) {
      console.error('Error toggling report:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar relatório",
        variant: "destructive",
      });
    }
  };

  const getScheduleText = (type: string, day: number) => {
    if (type === 'weekly') {
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return `Todo ${days[day - 1]}`;
    } else if (type === 'monthly') {
      return `Todo dia ${day} do mês`;
    }
    return 'Personalizado';
  };

  const addEmailRecipient = () => {
    setFormData(prev => ({
      ...prev,
      email_recipients: [...prev.email_recipients, '']
    }));
  };

  const removeEmailRecipient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      email_recipients: prev.email_recipients.filter((_, i) => i !== index)
    }));
  };

  const updateEmailRecipient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      email_recipients: prev.email_recipients.map((email, i) => 
        i === index ? value : email
      )
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Automáticos
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Criar Novo Relatório</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Nome do Relatório</Label>
                <Input
                  id="report-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Relatório Semanal de Performance"
                />
              </div>

              <div>
                <Label htmlFor="report-type">Tipo</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'weekly' | 'monthly' | 'custom') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="schedule-day">
                  {formData.type === 'weekly' ? 'Dia da Semana' : 'Dia do Mês'}
                </Label>
                <Input
                  id="schedule-day"
                  type="number"
                  min={1}
                  max={formData.type === 'weekly' ? 7 : 31}
                  value={formData.schedule_day}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule_day: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Destinatários de Email</Label>
                {formData.email_recipients.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmailRecipient(index, e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                    {formData.email_recipients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmailRecipient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addEmailRecipient}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Email
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label>Ativar relatório</Label>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={createReport}>
                  <Send className="h-4 w-4 mr-2" />
                  Criar Relatório
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {reports.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum relatório automático configurado
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{report.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.is_active ? "default" : "secondary"}>
                      {report.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Switch
                      checked={report.is_active}
                      onCheckedChange={(checked) => toggleReport(report.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {getScheduleText(report.type, report.schedule_day)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>Destinatários:</strong> {report.email_recipients.join(', ')}
                </div>
                
                {report.last_sent_at && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Último envio:</strong> {new Date(report.last_sent_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}