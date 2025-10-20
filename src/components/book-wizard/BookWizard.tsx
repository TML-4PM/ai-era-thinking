import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { WIZARD_STEPS } from "@/types/book-templates";
import { useBookWizard } from "@/hooks/useBookWizard";
import { Step1TemplateSelection } from "./steps/Step1TemplateSelection";
import { Step2BasicInfo } from "./steps/Step2BasicInfo";
import { Step3ChapterStructure } from "./steps/Step3ChapterStructure";
import { Step4PublishingOptions } from "./steps/Step4PublishingOptions";
import { Step5Review } from "./steps/Step5Review";

interface BookWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (bookId: string) => void;
}

export const BookWizard = ({ open, onOpenChange, onSuccess }: BookWizardProps) => {
  const wizard = useBookWizard();
  const { state } = wizard;
  const progress = (state.currentStep / WIZARD_STEPS.length) * 100;
  const currentStepInfo = WIZARD_STEPS[state.currentStep - 1];

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1TemplateSelection wizard={wizard} />;
      case 2:
        return <Step2BasicInfo wizard={wizard} />;
      case 3:
        return <Step3ChapterStructure wizard={wizard} />;
      case 4:
        return <Step4PublishingOptions wizard={wizard} />;
      case 5:
        return <Step5Review wizard={wizard} onSuccess={onSuccess} onClose={() => onOpenChange(false)} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create Your Book
          </DialogTitle>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Step {state.currentStep} of {WIZARD_STEPS.length}: {currentStepInfo.title}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>
        
        <div className="py-6">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
