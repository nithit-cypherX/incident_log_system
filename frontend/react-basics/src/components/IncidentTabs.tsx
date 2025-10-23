import React from 'react';

const tabs = [
  { name: 'Overview', href: '#' },
  { name: 'Log & Notes', href: '#' },
  { name: 'Attachments', href: '#' },
  { name: 'Personnel/Equipment', href: '#' },
];

const IncidentTabs = () => {
  return (
    <nav className="border-b border-[#495057] mb-6">
      <ul className="flex gap-8">
        {tabs.map((tab) => { 
          const isActive = tab.name === 'Overview'; 
          
          return (
            <li key={tab.name}>
              <a
                href={tab.href}
                className={`
                  inline-block py-3 text-sm font-medium
                  ${isActive 
                    ? 'text-[#F8F9FA] border-b-2 border-[#0D6EFD]' 
                    : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
                  }
                `}
              >
                {tab.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default IncidentTabs;