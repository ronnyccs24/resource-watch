import React from 'react';

// Utils
import { substitution } from 'utils/utils';

// Constants
import { PROVIDER_TYPES_DICTIONARY, FORM_ELEMENTS } from 'components/admin/dataset/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
// import UrlFileInput from 'components/form/UrlFileInput';
import Select from 'components/form/SelectInput';
import Title from 'components/ui/Title';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: props.dataset,
      form: props.form,
      carto: {}
    };

    // BINDINGS
    this.onCartoFieldsChange = this.onCartoFieldsChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  /**
    * UI EVENTS
    * - onCartoFieldsChange
    * - onLegendChange
  */
  onCartoFieldsChange() {
    const { cartoAccountUsername, tableName } = this.state.carto;

    const url = 'https://{{cartoAccountUsername}}.carto.com/tables/{{tableName}}/public';
    const params = [
      { key: 'cartoAccountUsername', value: cartoAccountUsername },
      { key: 'tableName', value: tableName }
    ];

    this.props.onChange({
      connectorUrl: substitution(url, params)
    });
  }

  onLegendChange(obj) {
    const legend = Object.assign({}, this.props.form.legend, obj);
    this.props.onChange({ legend });
  }


  render() {
    const { dataset } = this.state;
    const { provider } = this.state.form;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    const isCarto = (provider === 'cartodb');
    const isGee = (provider === 'gee');
    const isFeatureservice = (provider === 'featureservice');
    const isJson = (provider === 'json');
    const isCsv = (provider === 'csv');
    const isTsv = (provider === 'tsv');
    const isXml = (provider === 'xml');
    const isDocument = (isJson || isXml || isCsv || isTsv);

    return (
      <fieldset className="c-field-container">
        {dataset &&
          <Title className="form-title -big -secondary">
            Edit dataset
          </Title>
        }

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
          onChange={value => this.props.onChange({ name: value })}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Title',
            type: 'text',
            required: true,
            default: this.state.form.name
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.subtitle = c; }}
          onChange={value => this.props.onChange({ subtitle: value })}
          properties={{
            name: 'subtitle',
            label: 'Subtitle',
            type: 'text',
            default: this.state.form.subtitle
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.provider = c; }}
          onChange={value => this.props.onChange({
            provider: value,
            connectorType: (PROVIDER_TYPES_DICTIONARY[value]) ?
              PROVIDER_TYPES_DICTIONARY[value].connectorType : null
          })}
          validations={['required']}
          blank
          options={Object.keys(PROVIDER_TYPES_DICTIONARY).map(key => (
            {
              label: PROVIDER_TYPES_DICTIONARY[key].label,
              value: PROVIDER_TYPES_DICTIONARY[key].value
            }
          ))}
          properties={{
            name: 'provider',
            label: 'Provider',
            default: this.state.form.provider,
            value: this.state.form.provider,
            disabled: !!this.state.dataset,
            required: true,
            instanceId: 'selectProvider'
          }}
        >
          {Select}
        </Field>

        {/*
          *****************************************************
          ****************** CARTODB FIELDS * ***************
          *****************************************************
        */}
        {isCarto && !dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.cartoAccountUsername = c; }}
            onChange={(value) => {
              this.setState(
                { carto: { ...this.state.carto, cartoAccountUsername: value } }, () => {
                  this.onCartoFieldsChange('cartoAccountUsername', value);
                });
            }}
            validations={['required']}
            properties={{
              name: 'cartoAccountUsername',
              label: 'Carto account username',
              type: 'text',
              default: this.state.form.cartoAccountUsername,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {isCarto && !dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.tableName = c; }}
            onChange={(value) => {
              this.setState({ carto: { ...this.state.carto, tableName: value } }, () => {
                this.onCartoFieldsChange('tableName', value);
              });
            }}
            validations={['required']}
            properties={{
              name: 'tableName',
              label: 'Table name',
              type: 'text',
              default: this.state.form.tableName,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {isCarto && !!dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.connectorUrl = c; }}
            validations={['required']}
            properties={{
              name: 'connectorUrl',
              label: 'connectorUrl',
              type: 'text',
              default: this.state.form.connectorUrl,
              disabled: true,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {/*
          *****************************************************
          ****************** GEE FIELDS * ***************
          *****************************************************
        */}
        {isGee &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.tableName = c; }}
            onChange={value => this.props.onChange({ tableName: value })}
            validations={['required']}
            hint="Example: projects/wri-datalab/HansenComposite_14-15"
            properties={{
              name: 'tableName',
              label: 'Table name',
              type: 'text',
              default: this.state.form.tableName,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {/*
          *****************************************************
          ****************** FEATURE SERVICE ****************
          *****************************************************
        */}
        {isFeatureservice &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.connectorUrl = c; }}
            onChange={value => this.props.onChange({ connectorUrl: value })}
            validations={['required', 'url']}
            hint="Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson"
            properties={{
              name: 'connectorUrl',
              label: 'Url data endpoint',
              type: 'text',
              default: this.state.form.connectorUrl,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {/*
          *****************************************************
          ****************** DOCUMENT ****************
          *****************************************************
        */}
        {isDocument &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.connectorUrl = c; }}
            onChange={value => this.props.onChange({ connectorUrl: value })}
            validations={['required', 'url']}
            properties={{
              name: 'connectorUrl',
              label: 'Url data endpoint',
              type: 'text',
              default: this.state.form.connectorUrl,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {(isJson || isXml) &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataPath = c; }}
            onChange={value => this.props.onChange({ dataPath: value })}
            hint="Name of the element that you want to import"
            validations={(isXml) ? ['required'] : []}
            properties={{
              name: 'dataPath',
              label: 'Data path',
              type: 'text',
              default: this.state.form.dataPath,
              required: isXml
            }}
          >
            {Input}
          </Field>
        }

        {isDocument &&
          <div className="c-field-row">
            <div className="row l-row">
              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.lat = c; }}
                  onChange={value => this.onLegendChange({ lat: value })}
                  hint="Name of column with latitude value"
                  properties={{
                    name: 'lat',
                    label: 'Latitude',
                    type: 'text',
                    default: this.state.form.legend.lat
                  }}
                >
                  {Input}
                </Field>
              </div>

              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.long = c; }}
                  onChange={value => this.onLegendChange({ long: value })}
                  hint="Name of column with longitude value"
                  properties={{
                    name: 'long',
                    label: 'Longitude',
                    type: 'text',
                    default: this.state.form.legend.long
                  }}
                >
                  {Input}
                </Field>
              </div>

              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.date = c; }}
                  onChange={value => this.onLegendChange({ date: value })}
                  hint="Name of columns with date value (ISO Format)"
                  properties={{
                    name: 'date',
                    label: 'Date',
                    multi: true,
                    type: 'text',
                    creatable: true,
                    placeholder: 'Type the columns...',
                    noResultsText: 'Please, type the name of the columns and press enter',
                    promptTextCreator: label => `The name of the column is "${label}"`,
                    default: this.state.form.legend.date.map(
                      tag => ({ label: tag, value: tag })
                    ),
                    value: this.state.form.legend.date.map(
                      tag => ({ label: tag, value: tag })
                    )
                  }}
                >
                  {Select}
                </Field>
              </div>

              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.country = c; }}
                  onChange={value => this.onLegendChange({ country: value })}
                  hint="Name of columns with country value (ISO3 code)"
                  properties={{
                    name: 'country',
                    label: 'Country',
                    multi: true,
                    type: 'text',
                    creatable: true,
                    placeholder: 'Type the columns...',
                    noResultsText: 'Please, type the name of the columns and press enter',
                    promptTextCreator: label => `The name of the column is "${label}"`,
                    default: this.state.form.legend.country.map(
                      tag => ({ label: tag, value: tag })
                    ),
                    value: this.state.form.legend.country.map(
                      tag => ({ label: tag, value: tag })
                    )
                  }}
                >
                  {Select}
                </Field>
              </div>
            </div>
          </div>
        }

      </fieldset>
    );
  }
}

Step1.propTypes = {
  dataset: React.PropTypes.string,
  form: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step1;
