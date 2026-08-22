# Tutor Be Betea – End-to-End Testing Checklist

**Date:** _______________  
**Tester:** _______________  
**Environment:** Development / Staging

---

## A. Authentication
- [ ] Send OTP to real Ethiopian number (+2519...)
- [ ] Receive SMS within 30 seconds
- [ ] Verify correct OTP → success
- [ ] Verify wrong OTP → proper error
- [ ] Register as **Parent**
- [ ] Register as **Teacher**
- [ ] Login with existing account
- [ ] Logout clears token and redirects correctly
- [ ] Protected routes redirect to login when not authenticated

## B. Teacher Flow
- [ ] Complete Teacher Profile (bio, rates, subjects, grades)
- [ ] Set location using map picker
- [ ] Upload National ID → success message
- [ ] Upload Degree → success message
- [ ] Upload Liveness Selfie → success message
- [ ] See “Uploaded ✓” status
- [ ] View Available Jobs list
- [ ] Apply to a job with message
- [ ] View My Contracts
- [ ] Perform Check-in (inside geofence)
- [ ] Perform Check-in (outside geofence) → warning shown
- [ ] Submit Weekly Progress Report
- [ ] View Earnings screen
- [ ] Open Chat and send message
- [ ] Try sending phone number in chat → should be masked

## C. Parent Flow
- [ ] Add a Child
- [ ] View Children list
- [ ] Edit / view child details
- [ ] Find Tutors near me
- [ ] Open Tutor Profile → Trust Badges visible
- [ ] Post a new Job
- [ ] Create Contract + Fund Escrow
- [ ] View Contracts list
- [ ] Open Contract details
- [ ] View Progress Report
- [ ] Chat with Teacher
- [ ] Receive notification after key actions

## D. Admin Flow
- [ ] Login to Admin Console
- [ ] See pending documents in Verification Queue
- [ ] Open document (decrypt works for admin only)
- [ ] Approve document → Badge issued
- [ ] Reject document → Teacher notified
- [ ] Dashboard stats load correctly
- [ ] Audit logs are recorded

## E. System & UX
- [ ] Dark mode works on all main screens
- [ ] Light mode works on all main screens
- [ ] Pull-to-refresh works on lists
- [ ] Empty states appear correctly
- [ ] Loading skeletons appear while fetching
- [ ] Error states show “Try Again” button
- [ ] App does not crash on poor network

## Notes / Bugs Found
- 
- 
-
