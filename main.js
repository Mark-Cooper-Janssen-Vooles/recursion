// In the previous part, we worked with a simplified document format. In actual
// fact shapes can contain other shapes.
// 
// Given this new document format, can you modify your algorithm to calculate
// the average colour of the designs?
// 
// An updated fetchDesign function has been provided.
//
// Sample output:
// ```
// Design 1: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 2: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 3: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 4: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 5: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 6: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 7: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 8: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 9: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// Design 10: { r: 174.05882352941177 g: 192.8235294117647 b: 231.1764705882353 }
// ```

/**
 * @typedef {{
*   shapeId: string,
*   color: { r: number, g: number, b: number }
*   children: !Array<!Shape>
* }}
*/
let Shape;

/**
* @typedef {{
*  shapes: !Array<!Shape>>
* }}
*/
let Design;

/**
* @param {string} id
* @return {!Promise<!Design>}
*/
function fetchDesign(id) {
 return Promise.resolve({
   designId: id,
   shapes: [
     {shapeId: 'basic-shape', color: { r: 55, g: 40, b: 255 }, children: []},
     {shapeId: 'duck', color: { r: 255, g: 255, b: 252 }, children: [
       {shapeId: 'duck-bill', color: { r: 255, g: 255, b: 255 }, children: []},
       {shapeId: 'duck-body', color: { r: 205, g: 255, b: 252 }, children: []},
       {shapeId: 'duck-legs', color: { r: 100, g: 255, b: 252 }, children: []},
     ]},
     {shapeId: 'zigzag-polygon', color: { r: 205, g: 255, b: 252 }, children: []},
     {shapeId: 'fish', color: { r: 205, g: 255, b: 252 }, children: [
       {shapeId: 'fish-eyes', color: { r: 255, g: 255, b: 255 }, children: []},
       {shapeId: 'fish-fin', color: { r: 100, g: 66, b: 74 }, children: [
         {shapeId: 'fish-fin-part-1', color: { r: 0, g: 54, b: 55 }, children: [
          {shapeId: 'fish-fin-part-1', color: { r: 0, g: 54, b: 55 }, children: [
            {shapeId: 'fish-fin-part-1', color: { r: 0, g: 54, b: 55 }, children: []},
          ]},
         ]},
         {shapeId: 'fish-fin-part-2', color: { r: 33, g: 255, b: 255 }, children: []},
         {shapeId: 'fish-fin-part-3', color: { r: 128, g: 53, b: 255 }, children: []},
       ]},
       {shapeId: 'fish-tail', color: { r: 255, g: 5, b: 255 }, children: []},
     ]},
     {shapeId: 'duck', color: { r: 255, g: 255, b: 252 }, children: [
       {shapeId: 'duck-bill', color: { r: 255, g: 255, b: 255 }, children: []},
       {shapeId: 'duck-body', color: { r: 205, g: 255, b: 252 }, children: []},
       {shapeId: 'duck-legs', color: { r: 100, g: 255, b: 252 }, children: []},
     ]},
   ]
 })
}

// ---- Start your solution here ----


// get designs from API:
const getDesigns = async () => {
  try {
    const designSet = new Set()
    for (let i = 1; i < 11; i++) {
      designSet.add(fetchDesign(i))
    }
  
    const resolvedDesigns = await Promise.allSettled(designSet)
  
    resolvedSet = new Set(resolvedDesigns)
    setValues = new Set()
  
    resolvedSet.forEach((design) => {
      if (design.status === 'fulfilled') {
        setValues.add(design.value)
      }
    })
  
    return setValues
  } catch (e) {
    console.log('error:', e)
  }
}

// The approach is to flatten each designs colors, so colors exist at the same level for each design and can then be averaged.

// Step 1: createDesignMap() calls getDesigns above and turns the set into a map. It then calls checkEachParentDesign() which uses recursion to look through each parent design (in this case there are 10, as we made 10 mock API calls)

// Step 2: checkEachParentDesign() calls searchThroughParent() which also uses recursion, looking through all the keys of the parent design. 
// => It will create a new entry in the flattenedDesigns map for the parent designId if it does not already exist with an empty array as the value and will then iterate through the keys. 
// => If the current key is a children array, it will iterate through that array using recursion to again call searchThroughParent (which enables children of children of children .. etc to be searched through). 
// => If the current key is a color object, it will add to the flattenedDesigns map using the designId as the value, and push onto the array. 

// Step 3: Back in createDesignMap(), each entry in the flattenedDesigns map has its average colour values for R, G, B calculated and logged

const flattenedDesigns = new Map()

const searchThroughParent = (design, designId, status) => {
  //console.log(designId, status, item)

  Object.keys(design).forEach(key => {
    // create design in map based on designId if it doesn't exist
    if (!flattenedDesigns.get(designId)) {
      flattenedDesigns.set(designId, [])
    }

    // need to distinguish between a children array or a color object
    const isChildrenArray = typeof design[key] === "object" &&design[key] instanceof Array
    if (isChildrenArray) {
      if (design[key].length > 0) {
        // each object in the childrens array needs to be checked
        design[key].forEach(child => {
          searchThroughParent(child, designId, 'child')
        })
      }
    }

    const isColorObject = typeof design[key] === "object" && design[key].r !== undefined && design[key].g !== undefined && design[key].b !== undefined
    if (isColorObject) {
      flattenedDesigns.get(designId).push(design[key])
    }
  })
}

const logger = (design, key) => {
  const averageR = design.reduce((acc, currentVal) => acc + currentVal.r, 0) / design.length

  const averageG = design.reduce((acc, currentVal) => acc + currentVal.g, 0) / design.length

  const averageB = design.reduce((acc, currentVal) => acc + currentVal.b, 0) / design.length

  console.log(`Design ${key}: { r: ${averageR} g: ${averageG} b: ${averageB} }. This design has ${design.length} colors.`)

  console.log()
}

const checkEachParentDesign = (num, designMap) => {
  if (num <= 0) {
    return
  } else {
    const design = designMap.get(num) // array of 5 designs

    design.forEach((parentShape) => {
      searchThroughParent(parentShape, num, 'parent')
    })
  }
  
  return checkEachParentDesign(num - 1, designMap);
};

const createDesignMap = async () => {
  const designs = await getDesigns()
  const designMap = new Map()

  designs.forEach((design) => {
    designMap.set(design.designId, design.shapes)
  })

  console.log(designMap)

  checkEachParentDesign(designMap.size, designMap)

  flattenedDesigns.forEach((design, key) => {
    logger(design,key)
  })
}

createDesignMap()