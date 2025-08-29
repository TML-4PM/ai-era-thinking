import { Button } from "@/components/ui/button";
import { Download, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="font-semibold text-lg mb-4">Framework & Tools</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <a href="/organ_across_eras.csv" download>
                  <Button variant="outline" className="btn-enhanced">
                    <Download className="h-4 w-4 mr-2" />
                    Core Framework (CSV)
                  </Button>
                </a>
                <Link to="/tools">
                  <Button className="bg-gradient-warm btn-enhanced">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Implementation Tools
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <a href="/architecture_guts_by_era.csv" download>
                  <Button variant="outline" size="sm" className="btn-enhanced">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Architecture Data
                  </Button>
                </a>
                <a href="/governance_risks_metrics.csv" download>
                  <Button variant="outline" size="sm" className="btn-enhanced">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Governance Metrics
                  </Button>
                </a>
                <Link to="/governance">
                  <Button variant="outline" size="sm" className="btn-enhanced">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Risk Framework
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">About Leaders Live Forever</h3>
            <p className="text-muted-foreground mb-4">
              50 famous thinkers brought to life to discuss agentic AI and brain-computer interfaces. 
              Their wisdom transcends time through interactive exploration and practical implementation tools.
            </p>
            <div className="text-sm text-muted-foreground">
              © 2025 Tech 4 Humanity. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;