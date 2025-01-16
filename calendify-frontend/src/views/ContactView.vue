<!-- src/views/ContactView.vue -->
<template>
  <div class="contact-container">
    <h1>Contact Us</h1>
    <p>If you have any issues or inquiries, please fill out the form below and we will get back to you as soon as possible.</p>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nameOrEmail">Your Name or Email</label>
        <input type="text" id="nameOrEmail" v-model="nameOrEmail" required placeholder="Enter your name or email" />
      </div>

      <div class="form-group">
        <label for="issueDescription">Describe Your Problem</label>
        <textarea id="issueDescription" v-model="issueDescription" required placeholder="Describe your issue"></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "ContactView",
  data() {
    return {
      nameOrEmail: "",
      issueDescription: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async submitForm() {
      if (!this.nameOrEmail || !this.issueDescription) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      try {
        const response = await fetch("https://formspree.io/f/mjvqzdag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameOrEmail: this.nameOrEmail,
            issueDescription: this.issueDescription,
          }),
        });

        if (response.ok) {
          this.successMessage = "Thank you! Your message has been sent successfully.";
          this.errorMessage = "";
          this.nameOrEmail = "";
          this.issueDescription = "";
        } else {
          throw new Error("Failed to send the message. Please try again.");
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contact-container h1 {
  margin-bottom: 10px;
}

.contact-container p {
  color: #555;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  height: 120px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
