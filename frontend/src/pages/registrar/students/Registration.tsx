import React from 'react';
import { NewRegistration } from '../../admission-cell/NewRegistration';

export const Registration: React.FC = () => {
  // Reuse the exact same 12-phase robust wizard built for the Admission Cell
  return <NewRegistration />;
};
