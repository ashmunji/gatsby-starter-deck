import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate, StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';
import Transition from '../components/transition';

import './index.css';

const Header = ({ name, title, date }) => (
  <header>
    <a href="https://www.nimu.work" target="_self">Ashwini Munji</a>
    <time>{date}</time>
    <Link to="/1">
      <span>Go to the beginning</span>
    </Link>
  </header>
);

class TemplateWrapper extends Component {
  NEXT = [13, 32, 39];
  PREV = 37;

  swipeLeft = () => {
    this.navigate({ keyCode: this.NEXT[0] });
  };

  swipeRight = () => {
    this.navigate({ keyCode: this.PREV });
  };

  navigate = ({ keyCode }) => {
    const now = this.props.data.slide.index;
    const slidesLength = this.props.slidesLength;

    if (now) {
      if (keyCode === this.PREV && now === 1) {
        return false;
      } else if (this.NEXT.indexOf(keyCode) !== -1 && now === slidesLength) {
        return false;
      } else if (this.NEXT.indexOf(keyCode) !== -1) {
        navigate(`/${now + 1}`);
      } else if (keyCode === this.PREV) {
        navigate(`/${now - 1}`);
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.navigate);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.navigate);
  }

  render() {
    const { location, children, site } = this.props;

    return (
      <div>
        <Helmet
          title={`${site.siteMetadata.title} — ${site.siteMetadata.name}`}
        />
        <Header
          name={site.siteMetadata.name}
          title={site.siteMetadata.title}
          date={site.siteMetadata.date}
        />
        <Swipeable
          onSwipedLeft={this.swipeLeft}
          onSwipedRight={this.swipeRight}
        >
          <Transition location={location}>
            <div id="slide" style={{'width': '100%'}}>{children}</div>
          </Transition>
        </Swipeable>
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};

export default props => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
        site {
          siteMetadata {
            name
            title
            date
          }
        }
        allSlide {
          edges {
            node {
              id
            }
          }
        }
      }
    `}
    render={data => (
      <TemplateWrapper
        site={data.site}
        slidesLength={data.allSlide.edges.length}
        {...props}
      />
    )}
  />
);
