var NavDot = React.createClass({
  render: function() {
    var css = "";

    if (parseInt(this.props.number) == 1) 
      css = "first-dot active";

    var num_string = "#number_" + this.props.number;
    return (
      <li>
        <a className={css} href={num_string} data-scroll={this.props.number}></a>
        <span>
          <b>{this.props.title}</b>
        </span>
      </li>
    );
  }
});


var SideNav = React.createClass({
  componentDidMount: function() {
    $('.side-nav ul a').on('click', function() {
      var curAnchor = $('.side-nav ul a.active').attr('data-scroll');
      var scrollAnchor = $(this).attr('data-scroll');
      if (parseInt(curAnchor) < parseInt(scrollAnchor)) {
        var scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top;
      } else {
        var scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top-50;
      }
      $('body').stop().animate({
        scrollTop: scrollPoint
      }, 1000);
      return false;
    });
    $(document).scroll(function () {
      var scrollPos = $(document).scrollTop() + 100;
      $('.side-nav ul a').each(function () {
        var currLink = $(this);
        var scrollAnchor = $(this).attr('data-scroll');
        var refElement = $('section[data-anchor="' + scrollAnchor + '"]');
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $('.side-nav ul a.active').removeClass("active");
          currLink.addClass("active");
        } 
      });
    });
  },
  render: function() {
    return (
        <ul className="dot-nav">
          {this.props.items.map( function(currentValue, index) {
            return <NavDot title={currentValue} number={index+1} />;
          })}
        </ul>
    );
  }
});

React.render(<SideNav items={items} />, document.getElementsByClassName('side-nav')[0]);