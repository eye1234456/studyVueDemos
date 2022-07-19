<template>
  <div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories"
                @selectItem="selectItem"></tab-menu>

      <scroll id="tab-content" :data="[categoryData]">
        <div>
          <tab-content-category :subcategories="showSubcategory"></tab-content-category>
          <tab-control :titles="controlTitleList"
                       @itemClick="tabClick"></tab-control>
          <tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
  import NavBar from 'common/navbar/NavBar'

  import TabMenu from './childComps/TabMenu'
  import TabControl from 'content/tabControl/TabControl'
  import Scroll from 'common/scroll/Scroll'
  import TabContentCategory from './childComps/TabContentCategory'
  import TabContentDetail from './childComps/TabContentDetail'

  import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
  import {POP, SELL, NEW} from "@/common/const";
  import {tabControlMixin} from "@/common/mixin";
  import { fakeGoodsList } from '../../common/utils'

  export default {
		name: "Category",
    components: {
		  NavBar,
      TabMenu,
      TabControl,
      Scroll,
      TabContentCategory,
      TabContentDetail
    },
    mixins: [tabControlMixin],
    data() {
		  return {
		    categories: [],
        categoryData: {
        },
        currentIndex: -1,
        controlList:[
          {type: POP,title:'流行'},
          {type: NEW,title:'新款'},
          {type: SELL,title:'精选'}
        ],
      }
    },
    created() {
		  // 1.请求分类数据
      this._getCategory()
    },
    computed: {
		  showSubcategory() {
		    if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
        console.log('currentIndex',this.currentIndex);
        console.log('currentType',this.currentType);
        
		    if (this.currentIndex === -1) return []
        let categoryIndexData = this.categoryData[this.currentIndex];
        console.log('categoryData-i',categoryIndexData);
		    let data = categoryIndexData.categoryDetail[this.currentType]
        return data;
      },
      controlTitleList() {
        return this.controlList.map(item => item.title);
      }
      
    },
    methods: {
		  _getCategory() {
		    getCategory().then(res => {
          console.log('_getCategory:',res);
		      // 1.获取分类数据
          res.data = res.data ? res.data : {category:{list: 
            Array(10).fill(1).map((item,index) =>{
                return {
                  maitKey:`${index}`,
                  miniWallkey:`${index}`,
                  title:`分类:${index}`,
                };
            })
          }}
		      this.categories = res.data.category.list
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this._getSubcategories(0)
        })
      },
      _getSubcategories(index) {
        this.currentIndex = index;
		    const mailKey = this.categories[index].maitKey;
        let categoryTitle = this.categories[index].title;
        getSubcategory(mailKey).then(res => {
          console.log('_getSubcategories',res);
          let image = "https://s10.mogucdn.com/mlcdn/c45406/180913_036dli57aah85cb82l1jj722g887g_225x225.png";
          let link = "http://act.meilishuo.com/10dianlingquan?acm=3.mce.2_10_1dggc.13730.0.ccy5br4OlfK0U.pos_0-m_313898-sd_119"
          res.data = res.data ? res.data : {list:Array(10).fill(1).map((item,index) => {
            return {title:`${categoryTitle}-子分类${index}`,image,link}
          })};
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          let arr = [POP,NEW,SELL];
          arr.forEach(type => {
            this._getCategoryDetail(type)
          });
        })
      },
      _getCategoryDetail(type) {
		    // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        let categoryTitle = this.categories[this.currentIndex].title;
        let subBottomTitle = this.controlList.find(item => item.type === type).title;

        // 2.发送请求,传入miniWallkey和type
		    getCategoryDetail(miniWallkey, type).then(res => {
          console.log('_getCategoryDetail',res);
		      // 3.将获取的数据保存下来
		      this.categoryData[this.currentIndex].categoryDetail[type] = fakeGoodsList(20,0,`${categoryTitle}-${subBottomTitle}`);
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       * 事件响应相关的方法
       */
      selectItem(index) {
        this._getSubcategories(index)
      }
    }
	}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>
