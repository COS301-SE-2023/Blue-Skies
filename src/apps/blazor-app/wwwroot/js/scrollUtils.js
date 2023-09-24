window.scrollUtils = {
  getCurrentScrollPosition: function (dotnetHelper) {
    window.onscroll = function () {
      var scrollY = window.scrollY;
      dotnetHelper.invokeMethodAsync('UpdateScrollPosition', scrollY);
    };
  },
};

window.GenerateReport = function () {
  // Default export is a4 paper, portrait, using milimeters for units
  var doc = new jsPDF();

  doc.text('Hello world!', 10, 10);
  //SAVE IMAGE
  var img = new Image();
  img.src = '../assets/Logo.svg';
  doc.addImage(img, 'SVG', 10, 10, 100, 50);

  // doc.text('This is client-side Javascript, pumping out a PDF.', 10, 10);
  // doc.text('Do you like that?', 10, 20);

  // // Save the PDF

  doc.save('a4.pdf');
};

window.scrollToBottom = (elementId) => {
  var container = document.getElementById(elementId);
  if (container) {
      container.scrollTop = container.scrollHeight;
  }
};

window.initializeMouseFollower = (divToMove) => {
  const follower = divToMove;
  
  // Function to update the div's position based on mouse X coordinate
  const updatePosition = (e) => {
      const x = e.clientX;
      follower.style.left = x + 'px';
      x
  };
  
  // Add a mousemove event listener to track mouse movement
  document.addEventListener('mousemove', updatePosition);
};

