export const NFCSimulator = {
  cards: [
    {
      id: 'HK7S9A2B4C6D',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      status: 'active',
      lastUsed: '2024-01-20',
      hospital: 'Apollo Hospitals, Ahmedabad'
    },
    {
      id: 'HK8T1E3F5G7H',
      patientId: 'P002',
      patientName: 'Priya Sharma',
      issueDate: '2024-01-10',
      expiryDate: '2029-01-10',
      status: 'active',
      lastUsed: '2024-01-18',
      hospital: 'Fortis Hospital, Delhi'
    },
    {
      id: 'HK9I2J4K6L8M',
      patientId: 'P003',
      patientName: 'Amit Patel',
      issueDate: '2024-01-05',
      expiryDate: '2029-01-05',
      status: 'inactive',
      lastUsed: '2024-01-12',
      hospital: 'Max Hospital, Mumbai'
    }
  ],

  scanCard: (nfcId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const card = NFCSimulator.cards.find(c => c.id === nfcId);
        if (card) {
          // Log the scan
          const logs = JSON.parse(localStorage.getItem('healthkey_nfc_logs') || '[]');
          logs.push({
            nfcId,
            timestamp: new Date().toISOString(),
            action: 'scanned',
            location: 'Hospital Reception'
          });
          localStorage.setItem('healthkey_nfc_logs', JSON.stringify(logs));
          
          resolve({
            success: true,
            card,
            patientData: this.getPatientData(card.patientId)
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid NFC Card'
          });
        }
      }, 1000);
    });
  },

  getPatientData: (patientId) => {
    const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
    const patient = data.patients?.find(p => p.id === patientId);
    return patient || null;
  },

  issueNewCard: (patientId, hospitalId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNfcId = `HK${Date.now().toString(36).toUpperCase()}`;
        const newCard = {
          id: newNfcId,
          patientId,
          issueDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          issuedBy: hospitalId
        };
        
        NFCSimulator.cards.push(newCard);
        
        // Update patient record
        const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
        const patientIndex = data.patients?.findIndex(p => p.id === patientId);
        if (patientIndex > -1) {
          data.patients[patientIndex].nfcId = newNfcId;
          localStorage.setItem('healthkey_system', JSON.stringify(data));
        }
        
        resolve({
          success: true,
          nfcId: newNfcId,
          card: newCard
        });
      }, 2000);
    });
  },

  getCardLogs: (nfcId) => {
    const logs = JSON.parse(localStorage.getItem('healthkey_nfc_logs') || '[]');
    return logs.filter(log => log.nfcId === nfcId);
  },

  blockCard: (nfcId) => {
    const card = NFCSimulator.cards.find(c => c.id === nfcId);
    if (card) {
      card.status = 'blocked';
      card.blockedAt = new Date().toISOString();
      return true;
    }
    return false;
  },

  simulateTap: () => {
    const randomCard = NFCSimulator.cards[Math.floor(Math.random() * NFCSimulator.cards.length)];
    return NFCSimulator.scanCard(randomCard.id);
  }
};