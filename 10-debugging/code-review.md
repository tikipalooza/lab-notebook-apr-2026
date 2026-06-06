## Code Review Exercise

### Issue #1: Interactive links are coded as anchors without href

The `More Info` controls and `Load New Cat Facts` are `<a>` tags, but they do not have href attributes. 
They are being used as buttons. This is bad for keyboard accessibility and semantics.

**Initial code:**

```html
<a class="more-info-button">More Info</a>
<a class="reload-cat-facts">Load New Cats Facts</a>
```

**Updated code:**

```html
<button class="more-info-button" type="button">More Info</button>
<button class="reload-cat-facts" type="button">Load New Cat Facts</button>
```

### Issue #2: Submit and reset buttons are outside of the form

The `<form id="RequestInfo">` closes before the submit/reset buttons. Because of this, the submit and
reset inputs are not actually part of the form. To fix this issue, we just need to ensure the button container 
makes it inside of the form. 

**Initial Code:**
```html
  <!-- Rest of the form fields above -->

  <label class="form-label" for="message">
    Feel free to leave a message to us
  </label>
  <textarea
    class="form-textarea form-element-container"
    name="message"
    id="message"
    cols="30"
    rows="10"
  ></textarea>
</form>

<div
  class="form space-evenly-distributed-row-container form-buttons-container"
>
  <input class="form-button" type="submit" value="submit" />
  <input class="form-button" type="reset" value="reset" />
</div>
```

**Updated Code:**
```html
  <!-- all form fields stay here -->

  <label class="form-label" for="message">
    Feel free to leave a message to us
  </label>
  <textarea
    class="form-textarea form-element-container"
    name="message"
    id="message"
    cols="30"
    rows="10"
  ></textarea>

  <div class="space-evenly-distributed-row-container form-buttons-container">
    <input class="form-button" type="submit" value="submit" />
    <input class="form-button" type="reset" value="reset" />
  </div>
</form>
```

### Issue #3: Cat facts reload breaks after first load

In `fetchCatFacts()`, the `finally` block changes the loader container's class from `loading-container` to `display-none`.
After that the `createLoadingContainer()` would be unable to find the `.loading-container`. In the finally block, the entire class attribute is being replaced.
Because of this, the next reload can cause `document.querySelector('.loading-container')` to return null, and then appening the loader would throw an error. 

```js
loading.setAttribute('class', 'display-none');
```

The safer fix for this would be to preserve the permanent selector class and toggle the visibility class. 
This allows `.loading-container` to be available for future reloads while still allowing it to be hidden. 

**Initial Code:**
```js
const createLoadingContainer = function () {
  const loadingContainer = document.querySelector('.loading-container');
  const loader = document.createElement('img');
  loader.src = '../../images/loader.gif';
  loader.alt = 'loader gif while the data loads';
  loader.width = 60;
  loader.height = 60;
  loadingContainer.append(loader);
};

// Later:
finally {
  const loading = document.querySelector('.loading-container');
  loading.setAttribute('class', 'display-none');
}  
```

**Updated Code:**
```js
const createLoadingContainer = function () {
  const loadingContainer = document.querySelector('.loading-container');
  loadingContainer.classList.remove('display-none');
  loadingContainer.replaceChildren();

  const loader = document.createElement('img');
  loader.src = '../../images/loader.gif';
  loader.alt = 'loader gif while the data loads';
  loader.width = 60;
  loader.height = 60;
  loadingContainer.append(loader);
};

/* Later, hide the loader in the finally block */
finally {
  const loading = document.querySelector('.loading-container');
  loading.classList.add('display-none');
}
```

### Issue #4: Mobile navbar stays open after selecting a link

The small-screen navbar is controlled by a hidden checkbox. When the checkbox is checked, the mobile navbar is displayed. 
The issue is that selecting one of the navbar links does not uncheck the checkbox. As a result, this can make the navbar require an 
extra click. The fix is adding a JS listener that closes the mobile menu when a nav link is selected.

**Initial Code:**
```html
<input
  type="checkbox"
  class="navbar-toggle-trigger"
  id="navbar-toggle-trigger"
/>

<label
  for="navbar-toggle-trigger"
  id="navbar-toggle-expand-button"
  class="navbar-circular-icon-button"
  aria-label="open navbar list"
>
  <i class="fa-solid fa-bars"></i>
</label>

<div
  id="small-screen-navbar-element-container"
  class="small-screen-navbar-element-container"
>
  <ul class="nav-list">
    <li class="nav-list-item">
      <a href="#Introduction" class="nav-link hover-transition">
        Introduction
      </a>
    </li>
    <li class="nav-list-item">
      <a href="#History" class="nav-link hover-transition">History</a>
    </li>
    <li class="nav-list-item">
      <a href="#Characteristics" class="nav-link hover-transition">
        Characteristics
      </a>
    </li>
    <li class="nav-list-item">
      <a href="#CatFacts" class="nav-link hover-transition">
        Cat Facts
      </a>
    </li>
    <li class="nav-list-item">
      <a href="#RequestInfo" class="nav-link hover-transition">
        Request Info
      </a>
    </li>
  </ul>
</div>
```

```css
.navbar-toggle-trigger:checked ~ .small-screen-navbar-element-container {
  display: block;
}
```

**Updated Code**:
```js
const navbarToggle = document.getElementById('navbar-toggle-trigger');
const smallScreenNavLinks = document.querySelectorAll(
  '.small-screen-navbar .nav-link'
);

for (const navLink of smallScreenNavLinks) {
  navLink.addEventListener('click', () => {
    navbarToggle.checked = false;
  });
}
```
