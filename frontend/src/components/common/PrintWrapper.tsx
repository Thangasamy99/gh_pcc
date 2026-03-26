import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

interface PrintWrapperProps {
  children: React.ReactNode;
  btnText?: string;
  btnClassName?: string;
}

const PrintWrapper: React.FC<PrintWrapperProps> = ({ 
  children, 
  btnText = "Print Report",
  btnClassName = "flex items-center gap-2 px-4 py-2 bg-[#6C2BD9] text-white rounded-xl hover:bg-[#5b21b6] transition-colors shadow-sm font-medium text-sm"
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'PCC_Health_Services_Report',
  });

  return (
    <>
      <button 
        onClick={() => handlePrint()}
        className={`no-print ${btnClassName}`}
      >
        <Printer className="w-4 h-4" />
        {btnText}
      </button>

      <div className="hidden">
        <div ref={contentRef} className="p-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default PrintWrapper;
