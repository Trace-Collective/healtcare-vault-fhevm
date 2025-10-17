import { useNavigate } from "react-router-dom";
import { Calendar, Eye, Shield } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthRecord } from "@/types/records";
import { useUIStore } from "@/store/uiStore";
import { t } from "@/lib/i18n";

interface RecordCardProps {
  record: HealthRecord;
}

export const RecordCard = ({ record }: RecordCardProps) => {
  const navigate = useNavigate();
  const { language } = useUIStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const accessCount = record.grantedTo?.length || 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              {formatDate(record.createdAt)}
            </div>
          </div>
          <Badge variant={accessCount > 0 ? "default" : "secondary"}>
            {accessCount > 0 
              ? `${accessCount} ${language === 'id' ? 'Akses' : 'Access'}`
              : t('records.noAccess', language)
            }
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {record.contractId != null && (
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'ID Kontrak:' : 'Contract ID:'} #{record.contractId}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('records.encrypted', language)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'id'
              ? 'Data terenkripsi dengan FHE. Klik untuk melihat detail.'
              : 'Data encrypted with FHE. Click to view details.'}
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => navigate(`/records/${record.id}`)}
        >
          <Eye className="h-4 w-4" />
          {t('common.view', language)}
        </Button>
      </CardFooter>
    </Card>
  );
};
