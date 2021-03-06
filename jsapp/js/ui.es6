import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import autoBind from 'react-autobind';
import _ from 'underscore';

import bem from './bem';
import {t, assign} from './utils';
import classNames from 'classnames';

class SearchBox extends React.Component {
  constructor (props) {
    super(props);
    autoBind(this);
  }
  getValue () {
    return ReactDOM.findDOMNode(this.refs.inp).value;
  }
  setValue (v) {
    ReactDOM.findDOMNode(this.refs.inp).value = v;
  }
  render () {
    var elemId = _.uniqueId('elem');
    var value = this.props.value;
    return (
        <input type='text' ref='inp' className='k-search__input' value={value}
            onKeyUp={this.props.onKeyUp} onChange={this.props.onChange} id={elemId} placeholder={this.props.placeholder}/>
      );
  }
};

class Panel extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
        <bem.uiPanel className={this.props.className} m={this.props.m}>
          <bem.uiPanel__body>
            {this.props.children}
          </bem.uiPanel__body>
        </bem.uiPanel>
      );
  }
};


class Modal extends React.Component {
  constructor (props) {
    super(props);
    autoBind(this);
  }
  backdropClick (evt) {
    if (evt.currentTarget === evt.target) {
      this.props.onClose.call(evt);
    }
  }
  renderTitle() {
    if (!this.props.title) {
      return null;
    } else if (this.props.small) {
      return (
        <div>
          <bem.Modal__title>{this.props.title}</bem.Modal__title>
          <h6>{this.props.small}</h6>
        </div>
      );
    } else {
      return (
        <bem.Modal__title>{this.props.title}</bem.Modal__title>
      );
    }
  }
  render() {
    return (
      <bem.Modal__backdrop
        className='modal__backdrop'
        onClick={this.backdropClick}
      >
        <div className={classNames(
          'modal',
          this.props.className,
          this.props.open ? 'modal--open' : null,
          this.props.large ? 'modal--large' : null,
          this.props.icon ? 'modal--withicon' : null
        )}>
          {this.props.icon &&
            <i className={classNames('modal_icon', `modal_icon--${this.props.icon}`)} />
          }
          <bem.Modal__content>
            <bem.Modal__header>
              {this.renderTitle()}
              <a className='modal__x' type='button' onClick={this.props.onClose}>
                <i className='k-icon-close'/>
              </a>
            </bem.Modal__header>
            {this.props.children}
          </bem.Modal__content>
        </div>
      </bem.Modal__backdrop>
    );
  }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <bem.Modal__footer>
        {this.props.children}
      </bem.Modal__footer>
    );
  }
};

Modal.Footer = Footer;

class Body extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <bem.Modal__body>
        {this.props.children}
      </bem.Modal__body>
    );
  }
};

Modal.Body = Body;

class Tabs extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return <bem.Modal__tabs>{this.props.children}</bem.Modal__tabs>;
  }
};

Modal.Tabs = Tabs;

var BemSidebarAssetName = bem.create('sidebar-asset-name', '<span>');

class SidebarAssetName extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
        <BemSidebarAssetName m={{noname: !this.props.name}}>
          {this.props.name || t('No name')}
        </BemSidebarAssetName>
      );
  }
};

class AssetName extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    var name = this.props.name,
        extra = false,
        isEmpty;
    var summary = this.props.summary;
    var row_count;
    if (!name) {
      row_count = summary.row_count;
      name = summary.labels ? summary.labels[0] : false;
      if (!name) {
        isEmpty = true;
        name = t('no name');
      }
      if (row_count) {
        if (row_count === 2) {
          extra = <small>{t('and one other question')}</small>;
        } else if (row_count > 2) {
          extra = <small>{t('and ## other questions').replace('##', row_count - 1)}</small>;
        }
      }
    }
    return (
        <span className={isEmpty ? 'asset-name asset-name--empty' : 'asset-name'}>
          {name}
          {extra ?
            extra
          : null }
        </span>
      );
  }
};

class PopoverMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = assign({
      popoverVisible: false,
      popoverHiding: false,
      placement: 'below'
    });
    this._mounted = false;
    autoBind(this);
  }
  componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  toggle(evt) {
    var isBlur = evt.type === 'blur',
        $popoverMenu;

    if (isBlur && this.props.blurEventDisabled)
      return false;

    if (this.state.popoverVisible || isBlur) {
        $popoverMenu = $(evt.target).parents('.popover-menu').find('.popover-menu__content');
        this.setState({
          popoverHiding: true
        });
        // if we setState and immediately hide popover then links will not register as clicked
        window.setTimeout(()=>{
          if (!this._mounted)
            return false;

          this.setState({
            popoverVisible: false,
            popoverHiding: false
          });
        }, 200);
    } else {
      this.setState({
        popoverVisible: true,
      });
    }

    if (this.props.type == 'assetrow-menu' && !this.state.popoverVisible) {
      this.props.popoverSetVisible();
      var $assetRowOffset = $(evt.target).parents('.asset-row').offset().top;
      var $assetListHeight = $(evt.target).parents('.page-wrapper__content').height();
      if ($assetListHeight - $assetRowOffset < 150) {
        this.setState({
          placement: 'above',
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.popoverVisible && nextProps.clearPopover) {
      this.setState({
        popoverVisible: false
      });
    }
  }
  render () {
    return (
      <bem.PopoverMenu m={[this.props.type, this.state.placement]}>
        <bem.PopoverMenu__toggle onClick={this.toggle} onBlur={this.toggle} data-tip={this.props.triggerTip} tabIndex='1'>
          {this.props.triggerLabel}
        </bem.PopoverMenu__toggle>
        <bem.PopoverMenu__content m={[this.state.popoverHiding ? 'hiding' : '', this.state.popoverVisible ? 'visible' : 'hidden']}>
          {this.props.children}
        </bem.PopoverMenu__content>
      </bem.PopoverMenu>

    );
  }
};

var ui = {
  SearchBox: SearchBox,
  Panel: Panel,
  Modal: Modal,
  SidebarAssetName: SidebarAssetName,
  AssetName: AssetName,
  PopoverMenu: PopoverMenu
};

export default ui;
