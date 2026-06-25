import { Sun } from 'lucide-react';
import { type Theme } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

const themeLabels: Record<Theme, string> = {
  light: 'Light',
};

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled
      title="Theme: Light"
      aria-label="Theme: Light"
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Sun className="size-4" />
      <span className="hidden sm:inline">{themeLabels.light}</span>
    </Button>
  );
}
