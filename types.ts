export interface Prize {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  active: boolean;
  order: number;
}
