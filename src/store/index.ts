import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer, Contact, Visit, Opportunity, Quote, Message, Performance } from '@/types';
import {
  mockCustomers,
  mockContacts,
  mockVisits,
  mockOpportunities,
  mockQuotes,
  mockMessages,
  mockPerformance
} from '@/data/mock';
import { generateId } from '@/utils';

interface CRMState {
  customers: Customer[];
  contacts: Contact[];
  visits: Visit[];
  opportunities: Opportunity[];
  quotes: Quote[];
  messages: Message[];
  performance: Performance;

  addVisit: (visit: Omit<Visit, 'id'>) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  completeVisit: (id: string, data: { notes: string; photos: string[]; checkInTime: string; checkOutTime: string }) => void;

  addContact: (contact: Omit<Contact, 'id'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;

  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  updateOpportunityStage: (id: string, stage: Opportunity['stage']) => void;

  addQuote: (quote: Omit<Quote, 'id'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  submitQuoteForApproval: (id: string) => void;
  revokeQuote: (id: string) => void;

  addMessage: (message: Omit<Message, 'id'>) => Message;
  markMessageRead: (id: string) => void;
  markAllMessagesRead: () => void;

  syncOpportunityForApproval: (opportunityId: string) => void;
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      contacts: mockContacts,
      visits: mockVisits,
      opportunities: mockOpportunities,
      quotes: mockQuotes,
      messages: mockMessages,
      performance: mockPerformance,

      addVisit: (visit) => {
        const newVisit: Visit = {
          ...visit,
          id: 'v' + generateId()
        };
        set((state) => ({
          visits: [newVisit, ...state.visits]
        }));
        return newVisit;
      },

      updateVisit: (id, updates) => {
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          )
        }));
      },

      completeVisit: (id, data) => {
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: 'completed',
                  checkInTime: data.checkInTime,
                  checkOutTime: data.checkOutTime,
                  notes: data.notes,
                  photos: data.photos
                }
              : v
          )
        }));
      },

      addContact: (contact) => {
        const newContact: Contact = {
          ...contact,
          id: 'ct' + generateId()
        };
        set((state) => ({
          contacts: [...state.contacts, newContact]
        }));
        return newContact;
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      updateOpportunity: (id, updates) => {
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          )
        }));
      },

      updateOpportunityStage: (id, stage) => {
        const probabilityMap: Record<string, number> = {
          lead: 0.1,
          contact: 0.2,
          requirement: 0.4,
          quote: 0.5,
          negotiate: 0.7,
          win: 1,
          lost: 0
        };
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id
              ? { ...o, stage, probability: probabilityMap[stage] || o.probability }
              : o
          )
        }));
      },

      addQuote: (quote) => {
        const newQuote: Quote = {
          ...quote,
          id: 'q' + generateId()
        };
        set((state) => ({
          quotes: [newQuote, ...state.quotes]
        }));
        return newQuote;
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          )
        }));
      },

      submitQuoteForApproval: (id) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, status: 'submitted' as const } : q
          )
        }));
        const quote = get().quotes.find((q) => q.id === id);
        if (quote) {
          get().addMessage({
            type: 'approval',
            title: '报价单待审批',
            content: `${quote.title} 已提交审批，请等待主管审核。`,
            time: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            relatedId: quote.id,
            relatedType: 'quote'
          });
        }
      },

      revokeQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, status: 'draft' as const } : q
          )
        }));
      },

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: 'm' + generateId()
        };
        set((state) => ({
          messages: [newMessage, ...state.messages]
        }));
        return newMessage;
      },

      markMessageRead: (id) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          )
        }));
      },

      markAllMessagesRead: () => {
        set((state) => ({
          messages: state.messages.map((m) => ({ ...m, read: true }))
        }));
      },

      syncOpportunityForApproval: (opportunityId) => {
        const opportunity = get().opportunities.find((o) => o.id === opportunityId);
        if (opportunity) {
          get().addMessage({
            type: 'approval',
            title: '商机审批通知',
            content: `${opportunity.title} 已同步给主管审批，金额 ¥${(opportunity.amount / 10000).toFixed(1)}万。`,
            time: new Date().toISOString().slice(0, 16).replace('T', ' '),
            read: false,
            relatedId: opportunity.id,
            relatedType: 'opportunity'
          });
        }
      }
    }),
    {
      name: 'crm-storage'
    }
  )
);
