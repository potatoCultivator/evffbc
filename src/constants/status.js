export const REGISTRATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    DECLINED: 'declined'
};

export const STATUS_COLORS = {
    [REGISTRATION_STATUS.PENDING]: 'warning',
    [REGISTRATION_STATUS.APPROVED]: 'success',
    [REGISTRATION_STATUS.DECLINED]: 'error'
};

export const STATUS_LABELS = {
    [REGISTRATION_STATUS.PENDING]: 'Pending',
    [REGISTRATION_STATUS.APPROVED]: 'Approved',
    [REGISTRATION_STATUS.DECLINED]: 'Declined'
};
