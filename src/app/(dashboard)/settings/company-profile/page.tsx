
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { companiesData, Company } from "./mock-data";
import { columns } from "./columns";
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardRow, MobileCardTitle } from "@/components/ui/mobile-card";

export default function CompanyProfilePage() {
  const [companies, setCompanies] = useState<Company[]>(companiesData);

  const renderCompanyCard = (company: Company) => (
    <MobileCard key={company.id}>
      <MobileCardHeader>
        <MobileCardTitle>{company.name}</MobileCardTitle>
      </MobileCardHeader>
      <MobileCardContent>
        <MobileCardRow label="ID" value={company.id} />
      </MobileCardContent>
    </MobileCard>
  );

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold font-headline">Company Profile</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                    The company registered in the system.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={companies} filterColumn="name" renderRowAsCard={renderCompanyCard} />
        </CardContent>
      </Card>
    </div>
  );
}
