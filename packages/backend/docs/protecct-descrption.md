

### **1. Core Concept**

**QueueGo** is a real-time, pickup-only marketplace web application designed for hyper-local businesses in Goa. It allows customers to discover nearby vendors, join virtual queues remotely, and receive notifications when they are ready to be served. The primary goal is to reduce physical wait times and eliminate queue abandonment in busy tourist areas like Panjim or Calangute.

### **2. Technical Logic & Protocol**

The system logic is built around a centralized backend that manages state transitions for vendors and customers.

* **Real-Time Communication**: The system uses **Server-Sent Events (SSE)** to push real-time queue updates and ticket status changes to users.
* **Wait Time Estimation**: The app calculates wait times using an adaptive formula that balances recent service speed with a vendor-defined baseline.


### **3. Current Features & Limitations**

* **Virtual Ticketing**: Remote ticket generation with secret OTP codes for verification.
* **Vendor Dashboard**: Tools for vendors to call, skip, or complete tickets.



### **4. Mathematical Foundation**

The system provides users with a dynamic wait time estimate () using the following formula:

$$W = N \times \left[ (0.7 \times T_{\text{recent}}) + (0.3 \times T_{\text{default}}) \right]$$

**Variables:**

* : Total Estimated Wait Time displayed to the user.
* : Number of people currently ahead in the queue.
* : The average time of the last 3 completed tickets (reacts to current delays).
* : The static baseline service time set by the vendor.

