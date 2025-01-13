<!-- src/components/GroupChat.vue -->
<template>
  <div class="group-chat-container">
    <h2>Group Chat</h2>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.sender === currentUsername ? 'sent' : 'received']"
      >
        <span class="sender">{{ msg.sender }}</span>
        <span class="content">{{ msg.message }}</span>
        <span class="timestamp">{{ formatTimestamp(msg.timestamp) }}</span>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input">
      <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
          aria-label="Chat message input"
      />
      <button @click="sendMessage" class="send-button" aria-label="Send Message">Send</button>
    </div>
  </div>
</template>

<script>
import * as signalR from '@microsoft/signalr';
import { mapGetters, mapActions } from 'vuex';
import calendarService from '@/services/calendarService'; // Ensure correct path

export default {
  name: 'GroupChat',
  props: {
    calendarId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      connection: null,
      messages: [],
      newMessage: '',
      currentUsername: ''
    };
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    ...mapActions(['notify', 'fetchAllEvents']),

    /**
     * Initializes the SignalR connection and sets up event listeners.
     */
    async initializeSignalR() {
      try {
        // Fetch current user's username
        const response = await calendarService.getUserId(this.userId);
        this.currentUsername = response.data.username || 'Unknown';

        // Fetch negotiation info from backend
        const negotiateResponse = await calendarService.negotiate();

        const negotiateData = negotiateResponse.data;

        // Initialize SignalR connection
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(negotiateData.url, { accessTokenFactory: () => negotiateData.accessToken })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        // Receive messages
        this.connection.on('ReceiveMessage', (sender, message, timestamp) => {
          this.messages.push({ sender, message, timestamp });
          this.scrollToBottom();
        });

        // Start the connection
        await this.connection.start();
        console.log('SignalR Connected.');

        // Join the group corresponding to the calendar
        await this.connection.invoke('JoinGroup', this.calendarId);
      } catch (error) {
        console.error('SignalR Connection Error:', error);
        this.notify({ type: 'error', message: 'Failed to connect to chat.' });
      }
    },

    /**
     * Sends a message to the group via the backend.
     */
    async sendMessage() {
      if (this.newMessage.trim() === '') return;

      try {
        await calendarService.sendGroupMessage(this.calendarId, this.userId, this.newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
        this.notify({ type: 'error', message: 'Failed to send message.' });
      }
    },

    /**
     * Formats the timestamp for display.
     */
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    /**
     * Scrolls the messages container to the bottom.
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    }
  },
  mounted() {
    this.initializeSignalR();
  },
  beforeUnmount() {
    if (this.connection) {
      this.connection.stop();
    }
  }
};
</script>

<style scoped>
.group-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 10px;
}

.sent {
  text-align: right;
}

.received {
  text-align: left;
}

.sender {
  font-weight: bold;
  margin-right: 5px;
}

.content {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  background-color: #e1ffc7;
}

.sent .content {
  background-color: #c7dfff;
}

.timestamp {
  display: block;
  font-size: 0.8em;
  color: #666;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.send-button {
  margin-left: 10px;
  padding: 8px 14px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: var(--event-hover-color);
}
</style>
