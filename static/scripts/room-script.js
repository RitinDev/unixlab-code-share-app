document.addEventListener('DOMContentLoaded', function() {
    // const $log = document.querySelector('#log');
    const $codeText = document.querySelector('#code-text');
  
    /** @type {WebSocket | null} */
    var socket = null;
  
    // function log(msg, type = 'status') {
    //   $log.innerHTML += `<p class="msg msg--${type}">${msg}</p>`;
    //   $log.scrollTop += 1000;
    // }
  
    function connect() {
      disconnect();
  
      const { location } = window;
      const path = location.pathname;
      const roomName = path.substring(1); // Removes the leading '/'
  
      const proto = location.protocol.startsWith('https') ? 'wss' : 'ws';
      const wsUri = `${proto}://${location.host}/ws/${roomName}`;
  
      // log('Connecting...');
      socket = new WebSocket(wsUri);
  
      socket.onopen = () => {
        // log('Connected to room: ' + roomName);
      };
  
      socket.onmessage = (ev) => {
        // log('Received code update', 'message');
        $codeText.value = ev.data; // Update the code editor with the received code
      };
  
      socket.onclose = () => {
        // log('Disconnected from room: ' + roomName);
        socket = null;
      };
  
      socket.onerror = (error) => {
        // log('Error: ' + error.message, 'error');
      };
    }
  
    function disconnect() {
      if (socket) {
        // log('Disconnecting...');
        socket.close();
        socket = null;
      }
    }

    $codeText.addEventListener('input', (ev) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const code = $codeText.value;
        socket.send(code); // Send the code text to the WebSocket server
        // log('Sending code update...');
      }
    });
  
    // Connect to the WebSocket server as soon as the document is loaded
    connect();
  });