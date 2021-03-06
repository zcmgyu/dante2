import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import React from 'react';
import ReactDOM from 'react-dom';
//import Immutable from 'immutable'
import { Map, fromJS } from 'immutable';

import DanteEditor from './dante_editor.js';

import DanteImagePopover from './popovers/image';
import DanteAnchorPopover from './popovers/link';

//import { getSelectionRect, getSelection } from "../utils/selection.js"
import DanteInlineTooltip from './popovers/addButton';
import DanteTooltip from './popovers/toolTip';
//import Link from './decorators/link'

//import Debug from './debug'
//import findEntities from '../utils/find_entities'
import ImageBlock from './blocks/image';
import EmbedBlock from './blocks/embed';
import VideoBlock from './blocks/video';
import PlaceholderBlock from './blocks/placeholder';

import { resetBlockWithType, addNewBlockAt } from '../model/index.js';

var Dante = function () {
  function Dante(options) {
    _classCallCheck(this, Dante);

    if (options == null) {
      options = {};
    }
    console.log("init editor Dante!");

    // deep merge on config
    var config = Map(fromJS(this.defaultOptions(options)));

    this.options = config.mergeDeep(options).toJS();
    console.log(this.options);
  }

  Dante.prototype.defaultOptions = function defaultOptions(options) {
    // default options
    if (options == null) {
      options = {};
    }
    var defaultOptions = {};
    defaultOptions.el = 'app';
    defaultOptions.content = "";
    defaultOptions.read_only = false;
    defaultOptions.spellcheck = false;
    defaultOptions.title_placeholder = "Title";
    defaultOptions.body_placeholder = "Write your story";
    // @defaultOptions.api_key = "86c28a410a104c8bb58848733c82f840"

    defaultOptions.widgets = [{
      title: 'add an image',
      icon: 'image',
      type: 'image',
      block: ImageBlock,
      editable: true,
      renderable: true,
      breakOnContinuous: true,
      wrapper_class: "graf graf--figure",
      selected_class: "is-selected is-mediaFocused",
      selectedFn: function selectedFn(block) {
        var _block$getData$toJS = block.getData().toJS(),
            direction = _block$getData$toJS.direction;

        switch (direction) {
          case "left":
            return "graf--layoutOutsetLeft";
          case "center":
            return "";
          case "wide":
            return "sectionLayout--fullWidth";
          case "fill":
            return "graf--layoutFillWidth";
        }
      },
      handleEnterWithoutText: function handleEnterWithoutText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      },
      handleEnterWithText: function handleEnterWithText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      },

      widget_options: {
        displayOnInlineTooltip: true,
        insertion: "upload",
        insert_block: "image"
      },
      options: {
        upload_url: options.upload_url,
        upload_headers: options.upload_headers,
        upload_formName: options.upload_formName,
        upload_handler: options.image_upload_handler,
        upload_callback: options.image_upload_callback,
        image_delete_callback: options.image_delete_callback,
        image_caption_placeholder: options.image_caption_placeholder || "Write caption for image (optional)"
      }
    }, {
      icon: 'embed',
      title: 'insert embed',
      type: 'embed',
      block: EmbedBlock,
      editable: true,
      renderable: true,
      breakOnContinuous: true,
      wrapper_class: "graf graf--mixtapeEmbed",
      selected_class: "is-selected is-mediaFocused",
      widget_options: {
        displayOnInlineTooltip: true,
        insertion: "placeholder",
        insert_block: "embed"
      },
      options: {
        endpoint: '//api.embed.ly/1/extract?key=' + options.api_key + '&url=',
        placeholder: 'Paste a link to embed content from another site (e.g. Twitter) and press Enter'
      },
      handleEnterWithoutText: function handleEnterWithoutText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      },
      handleEnterWithText: function handleEnterWithText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      }
    }, {
      icon: 'video',
      title: 'insert video',
      editable: true,
      type: 'video',
      block: VideoBlock,
      renderable: true,
      breakOnContinuous: true,
      wrapper_class: "graf--figure graf--iframe",
      selected_class: " is-selected is-mediaFocused",
      widget_options: {
        displayOnInlineTooltip: true,
        insertion: "placeholder",
        insert_block: "video"
      },
      options: {
        endpoint: '//api.embed.ly/1/oembed?key=' + options.api_key + '&url=',
        placeholder: 'Paste a YouTube, Vine, Vimeo, or other video link, and press Enter',
        caption: 'Type caption for embed (optional)'
      },

      handleEnterWithoutText: function handleEnterWithoutText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      },
      handleEnterWithText: function handleEnterWithText(ctx, block) {
        var editorState = ctx.state.editorState;

        return ctx.onChange(addNewBlockAt(editorState, block.getKey()));
      }
    }, {
      renderable: true,
      editable: true,
      block: PlaceholderBlock,
      type: 'placeholder',
      wrapper_class: "is-embedable",
      selected_class: " is-selected is-mediaFocused",
      widget_options: {
        displayOnInlineTooltip: false
      },
      handleEnterWithText: function handleEnterWithText(ctx, block) {
        var editorState = ctx.state.editorState;

        var data = {
          provisory_text: block.getText(),
          endpoint: block.getData().get('endpoint'),
          type: block.getData().get('type')
        };

        return ctx.onChange(resetBlockWithType(editorState, data.type, data));
      }
    }];

    defaultOptions.tooltips = [{
      ref: 'insert_tooltip',
      component: DanteTooltip,
      displayOnSelection: true,
      selectionElements: ["unstyled", "blockquote", "ordered-list", "unordered-list", "unordered-list-item", "ordered-list-item", "code-block", 'header-one', 'header-two', 'header-three', 'header-four'],
      widget_options: {
        placeholder: "Paste or type a link",
        block_types: [
        // {label: 'p', style: 'unstyled'},
        { label: 'h2', style: 'header-one', type: "block" }, { label: 'h3', style: 'header-two', type: "block" }, { label: 'h4', style: 'header-three', type: "block" }, { label: 'blockquote', style: 'blockquote', type: "block" }, { label: 'insertunorderedlist', style: 'unordered-list-item', type: "block" }, { label: 'insertorderedlist', style: 'ordered-list-item', type: "block" }, { label: 'code', style: 'code-block', type: "block" }, { label: 'bold', style: 'BOLD', type: "inline" }, { label: 'italic', style: 'ITALIC', type: "inline" }]
      }
    }, {
      ref: 'add_tooltip',
      component: DanteInlineTooltip
    }, {
      ref: 'anchor_popover',
      component: DanteAnchorPopover
    }, {
      ref: 'image_popover',
      component: DanteImagePopover
    }];

    defaultOptions.xhr = {
      before_handler: null,
      success_handler: null,
      error_handler: null
    };

    defaultOptions.data_storage = {
      url: null,
      method: "POST",
      success_handler: null,
      failure_handler: null,
      interval: 1500,
      withCredentials: false,
      crossDomain: false,
      headers: {}
    };

    defaultOptions.default_wrappers = [{ className: 'graf--p', block: 'unstyled' }, { className: 'graf--h2', block: 'header-one' }, { className: 'graf--h3', block: 'header-two' }, { className: 'graf--h4', block: 'header-three' }, { className: 'graf--blockquote', block: 'blockquote' }, { className: 'graf--insertunorderedlist', block: 'unordered-list-item' }, { className: 'graf--insertorderedlist', block: 'ordered-list-item' }, { className: 'graf--code', block: 'code-block' }, { className: 'graf--bold', block: 'BOLD' }, { className: 'graf--italic', block: 'ITALIC' }];

    defaultOptions.continuousBlocks = ["unstyled", "blockquote", "ordered-list", "unordered-list", "unordered-list-item", "ordered-list-item", "code-block"];

    defaultOptions.key_commands = {
      "alt-shift": [{ key: 65, cmd: 'add-new-block' }],
      "alt-cmd": [{ key: 49, cmd: 'toggle_block:header-one' }, { key: 50, cmd: 'toggle_block:header-two' }, { key: 53, cmd: 'toggle_block:blockquote' }],
      "cmd": [{ key: 66, cmd: 'toggle_inline:BOLD' }, { key: 73, cmd: 'toggle_inline:ITALIC' }, { key: 75, cmd: 'insert:link' }]
    };

    defaultOptions.character_convert_mapping = {
      '> ': "blockquote",
      '*.': "unordered-list-item",
      '* ': "unordered-list-item",
      '- ': "unordered-list-item",
      '1.': "ordered-list-item",
      '# ': 'header-one',
      '##': 'header-two',
      '==': "unstyled",
      '` ': "code-block"
    };

    return defaultOptions;
  };

  Dante.prototype.getContent = function getContent() {
    return this.options.content;
  };

  Dante.prototype.render = function render() {
    return this.editor = ReactDOM.render(React.createElement(DanteEditor, { content: this.getContent(), config: this.options }), document.getElementById(this.options.el));
  };

  return Dante;
}();

// module.exports = Dante


export default Dante;