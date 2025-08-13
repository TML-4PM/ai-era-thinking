import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { CORE_METRICS, MetricsCalculator, SAMPLE_METRIC_DATA, type MetricDefinition } from "@/data/metrics";
import { cn } from "@/lib/utils";

interface MetricsDashboardProps {
  era?: string;
  className?: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ era, className }) => {
  const [calculator] = useState(() => {
    const calc = new MetricsCalculator();
    // Load sample data
    Object.entries(SAMPLE_METRIC_DATA).forEach(([metricId, values]) => {
      values.forEach(value => {
        calc.addValue(metricId, value.value, value.metadata);
      });
    });
    return calc;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredMetrics = CORE_METRICS.filter(metric => {
    const eraMatch = !era || metric.era.includes(era);
    const categoryMatch = selectedCategory === "all" || metric.category === selectedCategory;
    return eraMatch && categoryMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "acceptable": return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <TrendingDown className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-green-50 border-green-200";
      case "acceptable": return "bg-yellow-50 border-yellow-200";
      case "critical": return "bg-red-50 border-red-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const criticalMetrics = filteredMetrics.filter(metric => 
    calculator.getMetricStatus(metric.id) === "critical"
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Live Metrics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time governance and safety metrics {era && `for ${era} era`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedCategory("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
          >
            All
          </Button>
          {["safety", "fairness", "performance", "governance"].map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalMetrics.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Metrics Detected</AlertTitle>
          <AlertDescription>
            {criticalMetrics.length} metric{criticalMetrics.length > 1 ? 's' : ''} require immediate attention:
            {criticalMetrics.map(metric => (
              <Badge key={metric.id} variant="destructive" className="ml-2">
                {metric.name}
              </Badge>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => {
          const currentValue = calculator.getCurrentValue(metric.id);
          const status = calculator.getMetricStatus(metric.id);
          
          return (
            <Card key={metric.id} className={cn("framework-card", getStatusColor(status))}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1 capitalize">
                      {metric.category}
                    </Badge>
                  </div>
                  {getStatusIcon(status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {currentValue !== null ? currentValue.toFixed(2) : "N/A"}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {metric.updateFrequency}
                    </span>
                  </div>
                  
                  <CardDescription className="text-sm">
                    {metric.description}
                  </CardDescription>
                  
                  {/* Target indicators */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Optimal: ≤{metric.target.optimal}</span>
                      <span className="text-green-600">●</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Acceptable: ≤{metric.target.acceptable}</span>
                      <span className="text-yellow-600">●</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Critical: &gt;{metric.target.critical}</span>
                      <span className="text-red-600">●</span>
                    </div>
                  </div>
                  
                  {/* Applicable eras */}
                  <div className="flex flex-wrap gap-1">
                    {metric.era.map(eraName => (
                      <Badge key={eraName} variant="secondary" className="text-xs">
                        {eraName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Governance Insights */}
      <Card className="framework-card">
        <CardHeader>
          <CardTitle>Governance Insights</CardTitle>
          <CardDescription>
            Analysis based on current metric trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculator.getMetricStatus("surprise-index") === "critical" && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">High Surprise Index Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      AI outputs are deviating significantly from expected patterns. 
                      Consider reviewing model performance and triggering additional human oversight.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {calculator.getMetricStatus("override-frequency") === "critical" && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">High Override Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Agents requiring frequent human intervention. This may indicate the system 
                      needs more training or refinement before full autonomy.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {filteredMetrics.filter(m => calculator.getMetricStatus(m.id) === "optimal").length > 2 && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Strong Governance Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple metrics in optimal range. System governance appears to be 
                      functioning well. Continue monitoring for consistency.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDashboard;