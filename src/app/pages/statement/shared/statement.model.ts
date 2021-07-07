export interface IStatementResponse {
    aggregateId: string;
    type: string;
    category: string;
    description: string;
    documentNumber: string;
    bankBranch: string;
    bankAccount: string;
    amount: number;
    index: string;
    name: string;
    timestamp: string;
    data: {
        CorrelationId: string;
        Digitable: string;
        Assignor: string;
        Amount: number;
        OriginalAmount: number;
        RecipientDocument: any;
        RecipientName: any;
        Charges: {
            InterestAmountCalculated: number;
            FineAmountCalculated: number;
            DiscountAmount: number;
        },
        SettleDate: string;
        PaymentDate: string;
        Type: string;
        DueDate: string;
        Description: string;
        AuthenticationCode: string;
        PaymentStatus: string;
        PaymentType: string;
        CompanyKey: string;
        DocumentNumber: string;
        BankAccount: string;
        BankBranch: string;
        Id: string;
        CreatedAt: string;
        UpdatedAt: string;
        ConfirmationTransactionId: number;
        TransactionId: number;
        Version: number;
        ConfirmedAt: any,
        HasUncommittedEvents: boolean;
        TransactionReceipt: {
            Amount: number;
            AuthenticationCode: string;
            Description: string;
            DestinationAccount: string;
            DestinationAgency: string;
            DestinationBankName: string;
            DestinationCompe: string;
            DestinationDocument: string;
            DestinationName: string;
            TransactionDate: string;
        };
        RecipientAccount: {
            Agency: string;
            Account: string;
            Document: string;
            IspbNumber: string;
            Name: string;
        };
        SenderAccount: {
            Agency: string;
            Account: string;
            Document: string;
            IspbNumber: string;
            Name: string;
        };
    };
}

export interface IStatementNameTranslate {
    english: string;
    portuguese: string;
}
