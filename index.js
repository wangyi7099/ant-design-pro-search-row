/* eslint-disable */

// import { Select } from 'ant-design-vue'
/**
 * 默认的查询表单配置
 */
const defaultColConfig = {
  lg: 8,
  md: 12,
  xxl: 6,
  xl: 8,
  sm: 12,
  xs: 24
}

const defaultRowGutterConfig = { md: 8, lg: 24, xl: 48 }

/**
 * 合并用户和默认的配置
 * @param span
 * @param size
 */
const getSpanConfig = (span, size) => {
  if (typeof span === 'number') {
    return span
  }
  const config = {
    ...defaultColConfig,
    ...span
  }
  return config[size]
}

/**
 * 获取最后一行的 offset，保证在最后一列
 * @param length
 * @param span
 */
const getOffset = (length, span = 8) => {
  const cols = 24 / span
  return (cols - 1 - (length % cols)) * span
}

const MediaQueryEnum = {
  xs: {
    maxWidth: 575,
    matchMedia: '(max-width: 575px)'
  },
  sm: {
    minWidth: 576,
    maxWidth: 767,
    matchMedia: '(min-width: 576px) and (max-width: 767px)'
  },
  md: {
    minWidth: 768,
    maxWidth: 991,
    matchMedia: '(min-width: 768px) and (max-width: 991px)'
  },
  lg: {
    minWidth: 992,
    maxWidth: 1199,
    matchMedia: '(min-width: 992px) and (max-width: 1199px)'
  },
  xl: {
    minWidth: 1200,
    maxWidth: 1599,
    matchMedia: '(min-width: 1200px) and (max-width: 1599px)'
  },
  xxl: {
    minWidth: 1600,
    matchMedia: '(min-width: 1600px)'
  }
}

/**
 * loop query screen className
 * Array.find will throw a error
 * `Rendered more hooks than during the previous render.`
 * So should use Array.forEach
 */
const getWindowSize = () => {
  let className = 'md'

  const mediaQueryKey = Object.keys(MediaQueryEnum).find(key => {
    const { matchMedia } = MediaQueryEnum[key]
    if (window.matchMedia(matchMedia).matches) {
      return true
    }
    return false
  })

  className = mediaQueryKey
  return className
}

const ResponsiveSearchForm = {
  name: 'ResponsiveSearchForm',
  data() {
    return {
      collapse: true,
      colSize: getSpanConfig(defaultColConfig || 8, getWindowSize())
    }
  },
  methods: {
    handleFormReset() {
      this.$emit('reset')
    },
    // 根据屏幕尺寸计算出 md/lg 对应的 值， 比如 md 对应的值为8 ....
    setColSize() {
      this.colSize = getSpanConfig(defaultColConfig || 8, getWindowSize())
    },
    toggleForm() {
      this.collapse = !this.collapse
    }
  },
  render() {
    const rowNumber = 24 / this.colSize || 3
    const span = defaultColConfig
    const colConfig = typeof span === 'number' ? { span } : span
    const childrenArray = this.$slots.default
    const totalChildrenCount = childrenArray.length
    const filteredChildren = childrenArray

      .filter((_, index) => (this.collapse ? index < (rowNumber - 1 || 1) : true))
      .map((item, index) => (
        <a-col {...{ props: colConfig }} key={index}>
          {item}
        </a-col>
      ))
    const needExpand = totalChildrenCount >= rowNumber

    return (
      <div className="ant-pro-table-form-search">
        <a-row {...{ props: defaultRowGutterConfig }} gutter={16}>
          {filteredChildren}
          <a-col
            {...{ props: colConfig }}
            offset={needExpand ? getOffset(filteredChildren.length, this.colSize) : 0}
            style={{ textAlign: needExpand ? 'right' : 'left' }}
          >
            <a-button style={{ marginTop: 4 }} type="primary" htmlType="submit">
              查询
            </a-button>
            <a-button style={{ marginLeft: 8, marginTop: 4 }} onClick={this.handleFormReset}>
              重置
            </a-button>
            {needExpand ? (
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {this.collapse ? '展开' : '收起'} <a-icon type={this.collapse ? 'down' : 'up'} />
              </a>
            ) : null}
          </a-col>
        </a-row>
      </div>
    )
  },
  mounted() {
    window.addEventListener('resize', this.setColSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setColSize)
  }
}

ResponsiveSearchForm.install = function(Vue) {
  Vue.component(ResponsiveSearchForm.name, ResponsiveSearchForm)
}

export default ResponsiveSearchForm

