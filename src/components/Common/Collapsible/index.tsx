/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-deprecated */
import React, { PureComponent, ReactNode } from 'react';
import { Motion, spring } from 'react-motion';
import { Style, ViewStyleProps } from 'styles';

const SpringPrecision = 1;

const WAITING = 'WAITING';
const RESIZING = 'RESIZING';
const RESTING = 'RESTING';
const IDLING = 'IDLING';

const defTheme = {
  collapse: 'ReactCollapse--collapse',
  content: 'ReactCollapse--content',
};

interface CollabsibleTheme {
  [key: string]: string;
}

interface CollabsibleSpringConf {
  [key: string]: number;
}

interface Props extends ViewStyleProps {
  opened: boolean;
  forceInitialAnimation?: boolean;
  fixedHeight?: number;
  hasNestedCollapse?: boolean;
  children: ReactNode;
  theme?: CollabsibleTheme;
  springConfig?: CollabsibleSpringConf;
}

interface State {
  currentState: string;
  from: number;
  to: number;
}

export class Collapse extends PureComponent<Props, State> {
  private wrapper: HTMLDivElement | null = null;
  private content: HTMLDivElement | null = null;
  private raf: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentState: IDLING,
      from: 0,
      to: 0,
    };
  }

  componentDidMount() {
    const { opened, forceInitialAnimation } = this.props;
    if (opened) {
      const to = this.getTo();
      if (forceInitialAnimation) {
        const from = this.wrapper ? this.wrapper.clientHeight : 0;
        this.setState({ currentState: RESIZING, from, to });
      } else {
        this.setState({ currentState: IDLING, from: to, to });
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hasNestedCollapse) {
      // For nested collapses we do not need to change to waiting state
      // and should keep `height:auto`
      // Because children will be animated and height will not jump anyway
      // See https://github.com/nkbt/react-collapse/issues/76 for more details
      if (nextProps.opened !== this.props.opened) {
        // Still go to WAITING state if own opened was changed
        this.setState({ currentState: WAITING });
      }
    } else if (this.state.currentState === IDLING && (nextProps.opened || this.props.opened)) {
      this.setState({ currentState: WAITING });
    }
  }

  componentDidUpdate(_: Props, prevState: State) {
    const { opened } = this.props;

    if (this.state.currentState === IDLING) {
      return;
    }

    const from = this.wrapper ? this.wrapper.clientHeight : 0;
    const to = opened ? this.getTo() : 0;

    if (from !== to) {
      this.setState({ currentState: RESIZING, from, to });
      return;
    }

    if (this.state.currentState === RESTING || this.state.currentState === WAITING) {
      this.setState({ currentState: IDLING, from, to });
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  onContentRef = (content: HTMLDivElement) => {
    this.content = content;
  };

  onWrapperRef = (wrapper: HTMLDivElement) => {
    this.wrapper = wrapper;
  };

  onRest = () => {
    this.raf = requestAnimationFrame(this.setResting);
  };

  setResting = () => {
    this.setState({ currentState: RESTING });
  };

  getTo = () => {
    const { fixedHeight = -1 } = this.props;
    const clientHeight = this.content ? this.content.clientHeight : 0;
    return fixedHeight > -1 ? fixedHeight : clientHeight;
  };

  getWrapperStyle = (height: number) => {
    if (this.state.currentState === IDLING && this.state.to) {
      const { fixedHeight = -1 } = this.props;
      if (fixedHeight > -1) {
        return { overflow: 'hidden', height: fixedHeight };
      }
      return { height: 'auto' };
    }

    if (this.state.currentState === WAITING && !this.state.to) {
      return { overflow: 'hidden', height: 0 };
    }

    return { overflow: 'hidden', height: Math.max(0, height) };
  };

  getMotionProps = () => {
    const { springConfig } = this.props;

    return this.state.currentState === IDLING
      ? {
          // When completely stable, instantly jump to the position
          defaultStyle: { height: this.state.to },
          style: { height: this.state.to },
        }
      : {
          // Otherwise, animate
          defaultStyle: { height: this.state.from },
          style: { height: spring(this.state.to, { precision: SpringPrecision, ...springConfig }) },
        };
  };

  renderContent = ({ height }: { height: number }) => {
    // eslint-disable-line
    const {
      opened,
      springConfig,
      forceInitialAnimation,
      hasNestedCollapse,
      fixedHeight,
      theme = defTheme,
      style,
      children,
      ...props
    } = this.props;
    return (
      <div
        ref={this.onWrapperRef}
        className={theme.collapse}
        style={{ ...this.getWrapperStyle(Math.max(0, height)), ...style }}
        {...props}
      >
        <div ref={this.onContentRef} className={theme.content}>
          {children}
        </div>
      </div>
    );
  };

  render() {
    const props = this.getMotionProps() as any;
    return (
      <Motion {...props} onRest={this.onRest}>
        {this.renderContent}
      </Motion>
    );
  }
}

export default Collapse;
