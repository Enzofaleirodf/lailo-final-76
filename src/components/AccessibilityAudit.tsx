import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { setLocalStorageItem, getLocalStorageItem } from '@/services/localStorageService';
import { logError } from '@/utils/errorUtils';

// Define explicit type for accessibility issues
interface AccessibilityIssue {
  id: string;
  element: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl?: string;
}

// Define component props interface
interface AccessibilityAuditProps {
  // No props for now, but the interface is defined for future extensibility
}

/**
 * Component that performs a basic accessibility audit on the current page
 * This is a development tool and should not be included in production builds
 */
const AccessibilityAudit: React.FC<AccessibilityAuditProps> = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  
  // Run the audit
  const runAudit = async (): Promise<void> => {
    setIsRunning(true);
    setIssues([]);
    
    try {
      // Basic checks that can be done without external libraries
      const newIssues: AccessibilityIssue[] = [];
      
      // Check for images without alt text
      document.querySelectorAll('img').forEach((img: HTMLImageElement, index: number) => {
        if (!img.hasAttribute('alt')) {
          newIssues.push({
            id: `img-no-alt-${index}`,
            element: getElementPath(img),
            impact: 'serious',
            description: 'Image does not have an alt attribute',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/image-alt'
          });
        }
      });
      
      // Check for buttons without accessible names
      document.querySelectorAll('button').forEach((button: HTMLButtonElement, index: number) => {
        if (!button.textContent?.trim() && 
            !button.getAttribute('aria-label') && 
            !button.getAttribute('aria-labelledby')) {
          newIssues.push({
            id: `button-no-name-${index}`,
            element: getElementPath(button),
            impact: 'critical',
            description: 'Button does not have an accessible name',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/button-name'
          });
        }
      });
      
      // Check for form elements without labels
      document.querySelectorAll('input, select, textarea').forEach((input: HTMLElement, index: number) => {
        const inputId = input.getAttribute('id');
        if (inputId) {
          const hasLabel = document.querySelector(`label[for="${inputId}"]`);
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          
          if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
            newIssues.push({
              id: `input-no-label-${index}`,
              element: getElementPath(input),
              impact: 'critical',
              description: 'Form element does not have a label',
              helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/label'
            });
          }
        } else {
          // Input has no ID, so it can't be associated with a label
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          
          if (!hasAriaLabel && !hasAriaLabelledBy) {
            newIssues.push({
              id: `input-no-id-${index}`,
              element: getElementPath(input),
              impact: 'critical',
              description: 'Form element has no ID and cannot be associated with a label',
              helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/label'
            });
          }
        }
      });
      
      // Check for links with no text
      document.querySelectorAll('a').forEach((link: HTMLAnchorElement, index: number) => {
        if (!link.textContent?.trim() && 
            !link.getAttribute('aria-label') && 
            !link.getAttribute('aria-labelledby') &&
            !link.querySelector('img[alt]')) {
          newIssues.push({
            id: `link-no-text-${index}`,
            element: getElementPath(link),
            impact: 'serious',
            description: 'Link does not have text content',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/link-name'
          });
        }
      });
      
      // Check for headings that are not in a logical order
      let lastHeadingLevel = 0;
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading: HTMLHeadingElement, index: number) => {
        const level = parseInt(heading.tagName.substring(1));
        
        if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
          newIssues.push({
            id: `heading-order-${index}`,
            element: getElementPath(heading),
            impact: 'moderate',
            description: `Heading level ${level} follows heading level ${lastHeadingLevel}, skipping one or more levels`,
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/heading-order'
          });
        }
        
        lastHeadingLevel = level;
      });
      
      // Check for color contrast (this is a basic check and not as accurate as a full color contrast analyzer)
      document.querySelectorAll('*').forEach((element: Element, index: number) => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Skip elements with transparent background or no text
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || !element.textContent?.trim()) {
          return;
        }
        
        // This is a very basic check and not accurate
        // In a real implementation, you would use a color contrast algorithm
        if (color === backgroundColor) {
          newIssues.push({
            id: `color-contrast-${index}`,
            element: getElementPath(element),
            impact: 'serious',
            description: 'Element has the same text and background color',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast'
          });
        }
      });
      
      setIssues(newIssues);
      setLastRun(new Date());
    } catch (error) {
      logError(error, 'AccessibilityAudit.runAudit');
    } finally {
      setIsRunning(false);
    }
  };
  
  // Get a CSS selector path for an element
  const getElementPath = (element: Element | null): string => {
    if (!element) return 'unknown';
    
    let path = element.tagName.toLowerCase();
    
    if (element.id) {
      path += `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      path += `.${element.className.split(' ')[0]}`;
    }
    
    return path;
  };
  
  // Get a color for the impact level
  const getImpactColor = (impact: AccessibilityIssue['impact']): string => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Accessibility Audit</CardTitle>
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {lastRun && (
          <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200 text-sm text-gray-500">
            Last run: {lastRun.toLocaleString()}
          </div>
        )}
        
        {issues.length === 0 ? (
          <div className="p-4 text-center">
            {lastRun ? (
              <p className="text-green-600">No accessibility issues found!</p>
            ) : (
              <p className="text-gray-500">Run the audit to check for accessibility issues.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <div key={issue.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="outline" 
                    className={`${getImpactColor(issue.impact)}`}
                  >
                    {issue.impact}
                  </Badge>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {issue.element}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">{issue.description}</p>
                {issue.helpUrl && (
                  <a 
                    href={issue.helpUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Learn more
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Export with React.memo to prevent unnecessary re-renders
export default React.memo(AccessibilityAudit);