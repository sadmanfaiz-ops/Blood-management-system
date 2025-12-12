# How to Create Your Assignment PDF

## Step 1: Add Postman Screenshots

You need to add screenshots for each API. Here's what to do:

### For Each API Test in Postman:
1. **Open Postman** and make a successful request to each endpoint
2. **Press Print Screen (PrtScn)** or use Postman's built-in screenshot
3. **Paste into a document** and crop to show:
   - Request URL
   - Method (GET/POST/PUT)
   - Headers tab
   - Body tab (if applicable)
   - Response (200/201 status with JSON)

### Screenshots Needed (6 total):

**Feature 01 - Donor APIs:**
1. ✅ Search Donors (GET /api/donors/search?bloodGroup=A+)
2. ✅ Get Donor Profile (GET /api/donors/{id})

**Feature 02 - Request APIs:**
3. ✅ Create Blood Request (POST /api/requests)
4. ✅ View Own Requests (GET /api/requests/my)
5. ✅ Update Request Status (PUT /api/requests/{id}/status)
6. ✅ Edit Request Details (PUT /api/requests/{id})

---

## Step 2: Convert Markdown to PDF

### Option A: Using Google Docs (Easiest)
1. Go to **Google Docs** (docs.google.com)
2. Create **New Document**
3. Copy content from `ASSIGNMENT_REPORT.md`
4. Paste into Google Docs
5. Format and add screenshots
6. File → Download → PDF Document

### Option B: Using Microsoft Word
1. Open **Microsoft Word**
2. Create new document
3. Paste content from `ASSIGNMENT_REPORT.md`
4. Format and insert screenshots
5. File → Save As → PDF

### Option C: Using Online Markdown to PDF Converter
1. Go to https://md-to-pdf.herokuapp.com/ or https://pandoc.org/
2. Paste your markdown content
3. Convert to PDF
4. Download

---

## Step 3: Insert Screenshots into PDF

### In Google Docs/Word:
1. **Position cursor** where you want the screenshot
2. **Insert → Image** (or drag-drop image)
3. **Resize** to fit page nicely
4. **Add caption** like "Figure 1.1: Search Donors API Response"
5. **Align** screenshots properly for professional look

---

## Step 4: Final PDF Structure

Your PDF should have:

```
1. Title Page
   - Project Name
   - Student ID
   - Port Number
   - Date

2. Table of Contents

3. Project Overview
   - Description
   - Technology Stack
   - Database Info

4. Feature 01: Donor APIs
   - API 1.1 Documentation
   - Code Snippet
   - Screenshot
   - API 1.2 Documentation
   - Code Snippet
   - Screenshot

5. Feature 02: Request APIs
   - API 2.1 Documentation
   - Code Snippet
   - Screenshot
   - API 2.2 Documentation
   - Code Snippet
   - Screenshot
   - API 2.3 Documentation
   - Code Snippet
   - Screenshot
   - API 2.4 Documentation
   - Code Snippet
   - Screenshot

6. Server Configuration
   - Port Info
   - How to Run

7. Testing Summary
   - All tests passed

8. Conclusion
```

---

## Step 5: Quick Postman Test Screenshots

Here are the exact steps for each screenshot:

### Screenshot 1: Search Donors (No Filter)
```
Method: GET
URL: http://localhost:1320/api/donors/search
Headers: Content-Type: application/json
Expected Response: Array of 5 donors
```

### Screenshot 2: Search Donors by Blood Group
```
Method: GET
URL: http://localhost:1320/api/donors/search
Params: bloodGroup = A+
Expected Response: Rahim Ahmed (1 donor)
```

### Screenshot 3: Get Donor Profile
```
Method: GET
URL: http://localhost:1320/api/donors/6932e1dd83c870dd2b59010a
Headers: Content-Type: application/json
Expected Response: Full donor object with timestamps
```

### Screenshot 4: Create Blood Request
```
Method: POST
URL: http://localhost:1320/api/requests
Headers: Content-Type: application/json
Body: {
  "bloodGroup": "A+",
  "quantityRequired": 2,
  "hospitalName": "Square Hospital",
  "location": "Dhaka",
  "urgencyLevel": "High",
  "neededBefore": "2025-12-15T00:00:00.000Z"
}
Expected Response: 201 Created with request ID
```

### Screenshot 5: View Own Requests
```
Method: GET
URL: http://localhost:1320/api/requests/my
Headers: Content-Type: application/json
Expected Response: Array containing the request created in Screenshot 4
```

### Screenshot 6: Update Request Status
```
Method: PUT
URL: http://localhost:1320/api/requests/{id}/status
Headers: Content-Type: application/json
Body: { "status": "Cancelled" }
Expected Response: Request with updated status
```

### Screenshot 7: Edit Request Details
```
Method: PUT
URL: http://localhost:1320/api/requests/{id}
Headers: Content-Type: application/json
Body: {
  "quantityRequired": 3,
  "hospitalName": "Apollo Hospital",
  "location": "Chattogram",
  "urgencyLevel": "Medium"
}
Expected Response: Request with updated fields
```

---

## Step 6: Final Checklist

Before submitting, verify:

- [ ] All 6 API endpoints documented with details
- [ ] Code snippets included for each API
- [ ] Screenshots for each API showing successful response
- [ ] Port number is 1320 (mentioned throughout)
- [ ] Database connection details included
- [ ] Technology stack listed
- [ ] Server configuration documented
- [ ] All APIs tested and marked as PASSED
- [ ] Professional formatting and layout
- [ ] Table of contents with page numbers
- [ ] Conclusion section
- [ ] Student ID and submission date included

---

## Quick Conversion Command (Optional)

If you have Pandoc installed:
```bash
pandoc ASSIGNMENT_REPORT.md -o ASSIGNMENT_REPORT.pdf
```

---

## File Location
- **Markdown Report:** `c:\Users\USER\Downloads\Blood-management-system\ASSIGNMENT_REPORT.md`
- **Save PDF as:** `Blood_Donation_API_Assignment_[YourStudentID].pdf`
