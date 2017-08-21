import React from 'react';
import PropTypes from 'prop-types';

import { AtomicBlockUtils } from 'draft-js';

import { toastr } from 'react-redux-toastr';

// Services
import WidgetsService from 'services/WidgetsService';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

class ToolbarWidgetModal extends React.Component {
  static propTypes = {
    editorState: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      widgets: [],
      widget: null
    };

    this.widgetsService = new WidgetsService();
  }

  componentWillMount() {
    this.widgetsService.fetchAllData({})
      .then((widgets) => {
        this.setState({ widgets });
      })
      .catch((err) => {
        toastr.error(err);
      });
  }

  // onChange = (id) => {
  //   const editorState = this.props.editorState;
  //   const contentState = editorState.getCurrentContent();
  //   const blockMap = contentState.getBlocksAsArray();
  //
  //   const newBlockMap = htmlToDraft(
  //     `<iframe src="https://staging.resourcewatch.org/embed/widget/${id}" width="500" height="500" frameBorder="0"></iframe>`
  //   );
  //
  //   // Concat the new draft-html
  //   newBlockMap.contentBlocks = blockMap.concat(newBlockMap.contentBlocks);
  //
  //   // Create the new contentState and the new editorState
  //   const newContentState = ContentState.createFromBlockArray(
  //     newBlockMap.contentBlocks,
  //     newBlockMap.entityMap
  //   );
  //   const newEditorState = EditorState.createWithContent(newContentState);
  //
  //   // Push the new contentState and the new editorState
  //   const content = newEditorState.getCurrentContent();
  //   console.log(content);
  //   console.log(draftToHtml(convertToRaw(content)));
  //
  //   this.props.onChange(EditorState.push(newEditorState, newContentState, 'insert-fragment'));
  // }

  onChange = (id) => {
    const { editorState } = this.props;
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('EMBEDDED_LINK', 'MUTABLE', { src: `https://staging.resourcewatch.org/embed/widget/${id}`, height: 500, width: 500 })
      .getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' ',
    );

    this.props.onChange(newEditorState);
  }

  render() {
    return (
      <div className="c-field-container">
        {/* WIDGET */}
        <Field
          onChange={this.onChange}
          validations={['required']}
          className="-fluid"
          options={this.state.widgets.map(w => ({
            value: w.id,
            label: w.name
          }))}
          properties={{
            name: 'widget',
            label: 'Widgets',
            required: true,
            instanceId: 'selectDataset'
          }}
        >
          {Select}
        </Field>
      </div>
    );
  }
}

export default ToolbarWidgetModal;
