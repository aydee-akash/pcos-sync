import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DummyDataUploader = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');

  // Dummy gene names for variety
  const dummyGeneNames = [
    'INS', 'FSHR', 'CAPN10', 'LHCGR', 'AMH', 'CYP19A1', 'SHBG', 'AR', 
    'CYP17A1', 'PPARG', 'ADIPOQ', 'LEP', 'LEPR', 'TNF', 'IL6', 'VDR',
    'MTHFR', 'ACE', 'AGT', 'APOE'
  ];

  // Generate random DNA sequence
  const generateRandomSequence = (length = 20) => {
    const bases = ['A', 'T', 'C', 'G'];
    let sequence = '';
    for (let i = 0; i < length; i++) {
      sequence += bases[Math.floor(Math.random() * bases.length)];
    }
    return sequence;
  };

  // Determine phenotype based on criteria
  const determinePhenotype = (cysts, irregularCycle, hyperandrogenism) => {
    if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'Y') {
      return 'typeA';
    } else if (cysts === 'N' && irregularCycle === 'Y' && hyperandrogenism === 'Y') {
      return 'typeB';
    } else if (cysts === 'Y' && irregularCycle === 'N' && hyperandrogenism === 'Y') {
      return 'typeC';
    } else if (cysts === 'Y' && irregularCycle === 'Y' && hyperandrogenism === 'N') {
      return 'typeD';
    }
    return 'typeA'; // Default fallback
  };

  // Generate random criteria with weighted distribution
  const generateRandomCriteria = () => {
    const criteria = [];
    
    // Generate cysts (Y/N)
    criteria.push(Math.random() > 0.3 ? 'Y' : 'N');
    
    // Generate irregular cycle (Y/N)
    criteria.push(Math.random() > 0.2 ? 'Y' : 'N');
    
    // Generate hyperandrogenism (Y/N)
    criteria.push(Math.random() > 0.4 ? 'Y' : 'N');
    
    return criteria;
  };

  // Create dummy gene sequence object
  const createDummyGeneSequence = () => {
    const geneName = dummyGeneNames[Math.floor(Math.random() * dummyGeneNames.length)];
    const sequence = generateRandomSequence(15 + Math.floor(Math.random() * 10)); // 15-25 length
    const [cysts, irregularCycle, hyperandrogenism] = generateRandomCriteria();
    const phenotype = determinePhenotype(cysts, irregularCycle, hyperandrogenism);

    return {
      geneName,
      sequence,
      cysts,
      irregularCycle,
      hyperandrogenism,
      phenotype,
      createdAt: serverTimestamp(),
      criteria: {
        cysts,
        irregularCycle,
        hyperandrogenism
      }
    };
  };

  // Upload dummy data to Firestore
  const uploadDummyData = async () => {
    try {
      setUploadStatus('uploading');
      
      const geneSequencesRef = collection(db, 'geneSequences');
      const uploadPromises = [];

      // Create 20 dummy gene sequence objects
      for (let i = 0; i < 20; i++) {
        const dummyData = createDummyGeneSequence();
        uploadPromises.push(addDoc(geneSequencesRef, dummyData));
      }

      // Upload all documents
      await Promise.all(uploadPromises);
      
      setUploadStatus('completed');
      console.log('Successfully uploaded 20 dummy gene sequences to Firestore');
      
    } catch (error) {
      setUploadStatus('error');
      console.error('Error uploading dummy data:', error);
    }
  };

  useEffect(() => {
    // Only upload if status is idle (first load)
    if (uploadStatus === 'idle') {
      uploadDummyData();
    }
  }, []); // Empty dependency array ensures it runs only once

  // This component doesn't render anything visible
  return null;
};

export default DummyDataUploader; 