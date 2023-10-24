/**
 * @typedef {Object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

/**
 * Fylki af vörum sem hægt er að kaupa.
 * @type {Array<Product>}
 */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/**
 * @typedef {Object} CartLine
 * @property {Product} product Vara í körfu.
 * @property {number} quantity Fjöldi af vöru.
 */

/**
 * @typedef {Object} Cart
 * @property {Array<CartLine>} lines Fylki af línum í körfu.
 * @property {string|null} name Nafn á kaupanda ef skilgreint, annars `null`.
 * @property {string|null} address Heimilisfang kaupanda ef skilgreint, annars `null`.
 */

/**
 * Karfa sem geymir vörur sem notandi vill kaupa.
 * @type {Cart}
 */
const cart = {
  lines: [],
  name: null,
  address: null,
};

// --------------------------------------------------------
// Hjálparföll

/**
 * Sníða (e. format) verð fyrir íslenskar krónur með því að nota `Intl` vefstaðalinn.
 * Athugið að Chrome styður ekki íslensku og mun því ekki birta verð formuð að íslenskum reglum.
 * @example
 * const price = formatPrice(123000);
 * console.log(price); // Skrifar út `123.000 kr.`
 * @param {number} price Verð til að sníða.
 * @returns Verð sniðið með íslenskum krónu.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */
function formatPrice(price) {
	return new Intl.NumberFormat("de-DE").format(price) + " kr.";
}

/**
 * Athuga hvort `num` sé heiltala á bilinu `[min, max]`.
 * @param {number} num Tala til að athuga.
 * @param {number} min Lágmarksgildi tölu (að henni meðtaldri), sjálfgefið `0`.
 * @param {number} max Hámarksgildi tölu (að henni meðtaldri), sjálfgefið `Infinity`.
 * @returns `true` ef `num` er heiltala á bilinu `[min, max]`, annars `false`.
 */
function validateInteger(num, min = 0, max = Infinity) {
	// skilar false ef breytan num er ekki tala 
	if(!(typeof(num) === 'number'))
		return false;
	// skilar false ef breytan num er NaN
	else if(Number.isNaN(num))
		return false;
	// skilar false ef num er minni en lágmarksgildið eða stærri en hámarksgildið
	else if(num < min || num > max)
		return false;

	return true;
}

/**
 * Sníða upplýsingar um vöru og hugsanlega fjölda af henni til að birta notanda.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * ```
 * @param {Product} product Vara til að birta
 * @param {number | undefined} quantity Fjöldi af vöru, `undefined` ef ekki notað.
 * @returns Streng sem inniheldur upplýsingar um vöru og hugsanlega fjölda af henni.
 */
function formatProduct(product, quantity = undefined) {
	if(quantity === undefined || quantity === 1)
		return product.title + " - " + formatPrice(product.price);
	else 
		return product.title + " - " + quantity+"x"+formatPrice(product.price) + " samtals " + formatPrice(quantity*product.price);
}

/**
 * Skila streng sem inniheldur upplýsingar um körfu.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @param {Cart} cart Karfa til að fá upplýsingar um.
 * @returns Streng sem inniheldur upplýsingar um körfu.
 */
function cartInfo(cart) {
	let info = "";
	let sum = 0;
	for(let i = 0; i < cart.lines.length; i++)
	{
		info += formatProduct(cart.lines[i].product, cart.lines[i].number)+"\n";
		sum += cart.lines[i].product.price * cart.lines[i].number;
	}

	info += "Samtals: " + formatPrice(sum);

	return info;
}

// --------------------------------------------------------
// Föll fyrir forritið

/**
 * Bætir vöru við `products` fylkið með því að biðja um upplýsingar frá notanda um:
 * - Titil, verður að vera ekki tómur strengur.
 * - Lýsingu, verður að vera ekki tómur strengur.
 * - Verð, verður að vera jákvæð heiltala stærri en 0.
 * Ef eitthvað er ekki löglegt eru birt villuskilaboð í console og hætt er í fallinu.
 * Annars er ný vara búin til og upplýsingar um hana birtar í console.
 * @returns undefined
 */
function addProduct() {
  const title = prompt('Titill:');
  if (!title) {
    console.error('Titill má ekki vera tómur.');
    return;
  }

  const description = prompt('Lýsing:');
  if (!description) {
    console.error('Lýsing má ekki vera tóm.');
    return;
  }

  const priceAsString = prompt('Verð:');
  if (!priceAsString) {
    console.error('Verð má ekki vera tómt.');
    return;
  }

  const price = Number.parseInt(priceAsString, 10);

  if (!validateInteger(price, 1)) {
    console.error('Verð verður að vera jákvæð heiltala.');
    return;
  }

  const id = products.length + 1;

  /** @type {Product} */
  const product = {
    id,
    title,
    description,
    price,
  };

  products.push(product);

  console.info(`Vöru bætt við:\n${formatProduct(product)}`);
}

/**
 * Birta lista af vörum í console.
 * @example
 * ```text 
 * #1 HTML húfa — Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota. — 5.000 kr.
 * ```
 * @returns undefined
 */
function showProducts() {
	for(let i = 0; i < products.length; i++)
	{
		console.log("#"+products[i].id+" "+products[i].title+" - "+products[i].description+" - "+formatPrice(products[i].price));
	}
}

/**
 * Bæta vöru við körfu.
 * Byrjar á að biðja um auðkenni vöru sem notandi vill bæta við körfu.
 * Ef auðkenni er ekki heiltala, eru birt villa í console með skilaboðunum:
 * „Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.“
 * Ef vara finnst ekki með gefnu auðkenni, eru birt villa í console með skilaboðunum:
 * „Vara fannst ekki.“
 * Því næst er beðið um fjölda af vöru sem notandi vill bæta við körfu. Ef fjöldi er ekki heiltala
 * á bilinu `[1, 100>`, eru birtar villuskilaboð í console með skilaboðunum:
 * „Fjöldi er ekki löglegur, lágmark 1 og hámark 99.“
 * Ef vara og fjöldi eru lögleg gildi er vöru bætt við körfu. Ef vara er nú þegar í körfu er fjöldi
 * uppfærður, annars er nýrri línu bætt við körfu.
 *
 * @returns undefined
 */
function addProductToCart() {
 	const idAsString = prompt('Auðkenni vöru');
	if(!idAsString)
	{
		console.error("Auðkenni má ekki vera tómt.");
		return;
	}

	const id = Number.parseInt(idAsString);
	
	if(!validateInteger(id))
	{
		console.error("Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.");
		return;
	}

	if(!products.find((i) => i.id === id))
	{
		console.error("Vara fannst ekki.");
		return
	}

	const quantityAsString = prompt("Fjöldi");
	if(!quantityAsString)
	{
		console.error("Fjöldi má ekki vera tómur.");
	}

	const quantity = Number.parseInt(quantityAsString);

	if(!validateInteger(quantity, 1, 99))
	{
		console.error("Fjöldi er ekki löglegur, lágmark 1 og hámark 99.");
		return;
	}

	if(cart.lines.find((i) => i.product.id === id))
	{
		cart.lines.find((i) => i.product.id === id).number += quantity;
		console.info("Karfa uppfærð.");
		return;
	}

	/**@type {CartLine} **/
	const line = {
		product: products[id-1],
		number: quantity, 
	};

	cart.lines.push(line);

  	console.info(`Vöru bætt við í körfu:\n${formatProduct(line.product)}`);

	

  /* Hér ætti að nota `validateInteger` hjálparfall til að staðfesta gögn frá notanda */
  
  /* Til að athuga hvort vara sé til í `cart` þarf að nota `cart.lines.find` */
}

/**
 * Birta upplýsingar um körfu í console. Ef ekkert er í körfu er „Karfan er tóm.“ birt, annars
 * birtum við upplýsingar um vörur í körfu og heildarverð.
 *
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function showCart() {
  	if(cart.lines === undefined || cart.lines == 0)
	{
		console.log("Karfan er tóm.");
		return;
	}
	
	console.log(cartInfo(cart));
}

/**
 * Klárar kaup og birtir kvittun í console.
 * Ef ekkert er í körfu eru birt skilboð í console:
 * „Karfan er tóm.“
 * Annars er notandi beðinn um nafn og heimilisfang, ef annaðhvort er tómt eru birt villuskilaboð í
 * console og hætt í falli.
 * Ef allt er í lagi er kvittun birt í console með upplýsingum um pöntun og heildarverð.
 * @example
 * ```text
 * Pöntun móttekin <nafn>.
 * Vörur verða sendar á <heimilisfang>.
 *
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function checkout() {
  	if(cart.lines === "undefined" || cart.lines == 0)
	{
		console.log("Karfan er tóm.");
		return;
	}

	const name = prompt("Nafn");

	if(!name)
	{
		console.error("Nafn getur ekki verið tómt");
		return;
	}

	const address = prompt("Heimilisfang");

	if(!address)
	{
		console.error("Heimilisfang getur ekki verið tómt");
		return;
	}

	console.info("Pöntun móttekin "+ name + "\nVörur verða sendar á "+ address + "\n\n" + cartInfo(cart));

}
