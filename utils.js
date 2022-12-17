
export function renderTemplate1(template, contentId) {
  const content = document.getElementById(contentId)
  if (!content) {
    throw Error("No Element found for provided content id")
  }
  content.innerHTML = ""
  content.append(template)
}

export async function handleHttpErrors(res) {
  if (!res.ok) {
    const errorResponse = await res.json();
    const error = new Error(errorResponse.message)
    error.apiError = errorResponse
    throw error
  }
  return res.json()
}



/**
 * Appends the provided template to the node with the id contentId
 * @param {*} templ The HTML-Template to render
 * @param {string} contentId 
 */
 export function renderTemplate(templ, contentId) {
  const clone = templ.content.cloneNode(true)
  const content = document.getElementById(contentId)
  content.innerHTML = ""
  content.appendChild(clone)
}


/**
 * Loads an external file with an html-template, adds it to the body of your page, and returns the template
 * The file to be loaded can contain more than one template, but the one that will be returned must
 * be the first one in the file and this does not require an id
 * @param {string} page - Path to the file containing the template ('/templates/template.html')
 * @return {Promise<*>} On succesfull resolvement, the HtmlTemplate found in the file
 */
export async function loadTemplate(page) {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `)
    }
    return r.text()
  });
  //const body = document.getElementsByTagName("BODY")[0];
  const div = document.createElement("div");
  div.innerHTML = resHtml;
  //body.appendChild(div)
  //return div.querySelector("template")
  return div.querySelector("template")
};


export async function loadHtml(page) {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `)
    }
    return r.text()
  });
  const parser = new DOMParser()
  const content = parser.parseFromString(resHtml, "text/html")
  const div = content.querySelector(".template")
  if (!div) {
    throw new Error(`No outer div with class 'template' found in file '${page}'`)
  }
  return div
};

/**
 * Only meant for when Navigo is set to use Hash based routing (Always this semester)
 * If users try to enter your site with only "/", it will change this to "/#/" as required
 * for Hash based routing
 * Call it before you start using the router (add the specific routes)
 */
export function adjustForMissingHash() {
  let path = window.location.hash
  if (path == "") { //Do this only for hash
    path = "#/"
    window.history.pushState({}, path, window.location.href + path);
  }
}

/**
 * Sets active element on a div (or similar) containing a-tags (with data-navigo attributes ) used as a "menu"
 * Meant to be called in a before-hook with Navigo
 * @param topnav - Id for the element that contains the "navigation structure"
 * @param activeUrl - The URL which are the "active" one
 */
export function setActiveLink(topnav, activeUrl) {
  const links = document.getElementById(topnav).querySelectorAll("a");
  links.forEach(child => {
    child.classList.remove("active")
    //remove leading '/' if any
    if (child.getAttribute("href").replace(/\//, "") === activeUrl) {
      child.classList.add("active")
    }
  })
}

/**
 * Tablerows are required to be inside a table tag, so use this small utility function to santitize a string with TableRows only 
 * (made from data with map)
*/
export function sanitizeStringWithTableRows(tableRows) {
  let secureRows = DOMPurify.sanitize("<table>" + tableRows + "</table>")
  secureRows = secureRows.replace("<table>", "").replace("</table>", "")
  return secureRows
}


/**
 * HINT --> USE DOMPurify.santitize(..) instead, to sanitize a full string of tags to be inserted via innerHTLM
 * The encoder method we have used when inserting untrusted data via the innerHTML property
 * Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
 * @param str --> the string to encode 
 * @returns the encoded string
 */
export function encode(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}
