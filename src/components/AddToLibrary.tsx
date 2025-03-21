
import { ReadingStatus } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { loadBooks, saveBook } from "@/services/supabaseBooks";

interface AddToLibraryProps {
  onStatusChange: (status: ReadingStatus) => void;
  currentStatus?: ReadingStatus;
  bookId: string;
  bookTitle: string;
  bookAuthor: string | string[];
}

export function AddToLibrary({ 
  onStatusChange, 
  currentStatus, 
  bookId, 
  bookTitle, 
  bookAuthor 
}: AddToLibraryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: ReadingStatus) => {
    setIsLoading(true);
    try {
      // La vérification des doublons est maintenant gérée directement dans saveBook
      // Pas besoin de l'implémenter ici
      const result = await onStatusChange(status);
      
      // Le composant parent (qui appelle la méthode saveBook) gère maintenant
      // l'affichage du toast de succès
      
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'ajout du livre",
      });
      console.error("Erreur lors de l'ajout du livre:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusLabels: Record<ReadingStatus, string> = {
    'to-read': 'À lire',
    'reading': 'En cours',
    'completed': 'Lu'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <BookPlus className="mr-2 h-4 w-4" />
          {currentStatus ? statusLabels[currentStatus] : "Ajouter à ma bibliothèque"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as ReadingStatus)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
