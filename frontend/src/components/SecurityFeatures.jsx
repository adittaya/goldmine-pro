import React from 'react';
import { FaShieldAlt, FaLock, FaUserShield, FaServer } from 'react-icons/fa';

const SecurityFeature = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-md p-md bg-tertiary rounded-lg">
      <div className="text-primary text-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-sm">{title}</h3>
        <p className="text-secondary text-sm">{description}</p>
      </div>
    </div>
  );
};

const SecurityFeatures = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Military-Grade Encryption",
      description: "Your data is protected with AES-256 encryption, the same used by banks and government agencies."
    },
    {
      icon: <FaLock />,
      title: "Secure Transactions",
      description: "All transactions are secured with multiple layers of authentication and real-time fraud detection."
    },
    {
      icon: <FaUserShield />,
      title: "Identity Verification",
      description: "Advanced KYC processes ensure only legitimate users can access the platform."
    },
    {
      icon: <FaServer />,
      title: "Cloud Security",
      description: "Enterprise-grade infrastructure with 99.9% uptime guarantee and automatic backups."
    }
  ];

  return (
    <div className="mb-xl">
      <h2 className="font-bold text-xl mb-lg text-center">Enterprise Security</h2>
      <div className="grid grid-cols-1 gap-md">
        {features.map((feature, index) => (
          <SecurityFeature key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default SecurityFeatures;