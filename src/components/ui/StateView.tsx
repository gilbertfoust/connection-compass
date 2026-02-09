import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <Loader2 className="h-6 w-6 text-primary animate-spin" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-10 space-y-3">
    <div className="text-muted-foreground/40 flex justify-center">{icon}</div>
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    {description && <p className="text-xs text-muted-foreground/60">{description}</p>}
    {action && (
      <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2 rounded-full">
        {action.label}
      </Button>
    )}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => (
  <div className="text-center py-10 space-y-3">
    <AlertCircle className="h-10 w-10 text-destructive/60 mx-auto" />
    <p className="text-sm font-medium text-foreground">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry} className="rounded-full">
        Try Again
      </Button>
    )}
  </div>
);

interface PartnerRequiredStateProps {
  feature: string;
  description?: string;
}

export const PartnerRequiredState = ({ feature, description }: PartnerRequiredStateProps) => {
  const navigate = useNavigate();
  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-6 text-center space-y-4">
        <Users className="h-10 w-10 text-muted-foreground mx-auto" />
        <div>
          <h3 className="font-semibold text-foreground">Link a Partner First</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description || `${feature} requires you to be linked with your partner. Share your invite code or enter theirs to get started.`}
          </p>
        </div>
        <Button onClick={() => navigate('/partner')} className="rounded-full">
          Go to Partner Link
        </Button>
      </CardContent>
    </Card>
  );
};
