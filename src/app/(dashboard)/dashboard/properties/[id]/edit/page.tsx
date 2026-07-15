import { notFound } from "next/navigation";
import { getPropertyById } from "@/modules/property/actions";
import { PropertyForm } from "../property-form";

interface PropertyData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  address: string;
  city: string;
  state: string | null;
  zipCode: string | null;
}

interface EditPropertyPageProps {
  params: { id: string };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const result = await getPropertyById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <PropertyForm property={result.data as PropertyData} mode="edit" />
  );
}
