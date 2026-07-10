export interface SerializedSupplier {
  id: string;
  name: string;
  nif: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
