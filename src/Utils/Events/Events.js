$( () => {
  // Crear tooltip dinámico
  const tooltip = $('<div id="customTooltip"></div>')
    .css({
      position: 'fixed',
      background: '#000',
      color: '#fff',
      padding: '6px 12px',
      'border-radius': '6px',
      'font-size': '14px',
      'z-index': '9999',
      display: 'none'
    })
    .appendTo('body');

    $(document).on('mouseenter', '.menu-btn', function (e) {
        const title = $(this).data('title');
        
        tooltip.text(title).fadeIn(150);

        const offset = $(this).offset();
        const height = $(this).outerHeight();

        tooltip.css({
        top: offset.top + height / 2 - tooltip.outerHeight() / 2,
        left: offset.left + $(this).outerWidth() + 12
        });
    });

    $(document).on('mouseleave', '.menu-btn', function () {
        tooltip.fadeOut(150);
    });
} )
