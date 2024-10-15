Cypress.Commands.add('pauseAndBlackOutVideos', () => {
    cy.get('#player .vp-telecine video', { timeout: 10000 }).then(($video) => { // Adjust the selector as necessary
      if ($video.length > 0) {
        // Pause video and hide it with a black overlay
        $video.get(0).pause();
        const { width, height } = $video.get(0).getBoundingClientRect();
        cy.wrap($video).css('display', 'none');
        cy.wrap($video).parent().append(`<div style="background-color:black; width:${width}px; height:${height}px; position:absolute;z-index:10;"></div>`);
      } else {
        cy.log('Video element not found.');
      }
    });
  });