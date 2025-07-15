import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, UserMinus, Crown, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  owner_id: string;
  member_id: string;
  role: string;
  permissions: string[];
  invited_at: string;
  accepted_at: string | null;
  is_active: boolean;
  member_email?: string;
  member_name?: string;
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer',
    permissions: [] as string[],
  });

  const roles = [
    { key: 'admin', label: 'Admin', icon: Crown, description: 'Acesso total ao sistema' },
    { key: 'editor', label: 'Editor', icon: Edit, description: 'Pode editar campanhas e visualizar relatórios' },
    { key: 'viewer', label: 'Visualizador', icon: Eye, description: 'Apenas visualização' },
  ];

  const availablePermissions = [
    'manage_campaigns',
    'view_reports',
    'manage_budgets',
    'manage_automations',
    'manage_team',
  ];

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get profile info for each member
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', member.member_id)
            .single();

          return {
            ...member,
            member_email: profile?.email || 'Email não encontrado',
            member_name: profile?.full_name || 'Nome não encontrado',
          };
        })
      );

      setMembers(membersWithProfiles);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar membros da equipe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    try {
      // First, check if a profile exists for this email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado. O usuário deve ter uma conta no sistema.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('team_members')
        .insert({
          owner_id: user?.id,
          member_id: profile.id,
          role: formData.role,
          permissions: formData.permissions,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro convidado com sucesso",
      });

      setShowForm(false);
      setFormData({
        email: '',
        role: 'viewer',
        permissions: [],
      });
      fetchMembers();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Erro",
        description: "Erro ao convidar membro",
        variant: "destructive",
      });
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Membro removido da equipe",
      });

      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro",
        variant: "destructive",
      });
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => 
        prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
      );

      toast({
        title: "Sucesso",
        description: "Função do membro atualizada",
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar função",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.key === role);
    return roleData ? roleData.icon : Users;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'default';
      case 'viewer':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Equipe
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
            <Users className="h-5 w-5" />
            Gerenciamento de Equipe
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Membro
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Convidar Novo Membro</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="member-email">Email do Membro</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div>
                <Label htmlFor="member-role">Função</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.key} value={role.key}>
                        <div className="flex items-center gap-2">
                          <role.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={inviteMember}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {members.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum membro na equipe
          </p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              
              return (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.member_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">{member.member_name}</div>
                        <div className="text-sm text-muted-foreground">{member.member_email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                          updateMemberRole(member.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.key} value={role.key}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Badge variant={getRoleColor(member.role)}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {member.role}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Convidado em:</strong> {new Date(member.invited_at).toLocaleDateString()}
                    {member.accepted_at && (
                      <span className="ml-4">
                        <strong>Aceito em:</strong> {new Date(member.accepted_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}