import React from 'react';

interface PrintHeaderProps {
  title?: string;
  showSignature?: boolean;
  medicalOfficerName?: string;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ 
  title, 
  showSignature = false,
  medicalOfficerName = 'Medical Officer in Charge'
}) => {
  return (
    <div className="print-only mb-8 font-serif">
      <div className="flex justify-between items-center border-b-2 border-[#1e3a8a] pb-4 mb-6">
        {/* Left Logo - PCC Main */}
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src="/images/logo.png" 
            alt="PCC Logo" 
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        </div>

        {/* Center Text Section */}
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-[#1e3a8a] uppercase tracking-wide leading-tight">
            Presbyterian Church in Cameroon
          </h1>
          <h2 className="text-xl font-semibold text-[#1e40af] uppercase mt-1">
            Health Services
          </h2>
          <p className="italic text-gray-700 text-sm mt-1">
            "Compassionate Quality Healthcare"
          </p>
          <div className="text-xs text-gray-600 mt-2 leading-relaxed">
            P.O. Box 19, Buea, South West Region, Republic of Cameroon <br />
            Email: info@pcchealthservices.org | Web: www.pcc.cm
          </div>
        </div>

        {/* Right Logo - PCC Health Services */}
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src="/images/logo.png" 
            alt="Health Services Logo" 
            className="max-w-full max-h-full object-contain filter hue-rotate-180"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        </div>
      </div>
      
      {/* Document Identification */}
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold uppercase border-b border-gray-300 inline-block px-8 pb-1 text-gray-800">
            {title}
          </h3>
        </div>
      )}

      {/* Signature line for specific reports */}
      {showSignature && (
        <div className="mt-20 flex justify-end">
          <div className="text-center w-64 border-t border-gray-400 pt-2">
            <p className="text-sm font-bold text-gray-800">{medicalOfficerName}</p>
            <p className="text-xs text-gray-500 uppercase">Signature & Date</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintHeader;
