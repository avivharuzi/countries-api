"use strict";

const RESULTS = $("#results");

$(function () {
    $("#searchCountry").on("click", function () {
        countriesByFilter();
    });

    $("#searchAll").on("click", function () {
        allCountries();
    });
});

async function countriesByFilter() {
    let countryValue = $("#countryValue").val();
    let filterCountry = $("#filterCountry").val();

    if (countryValue !== "") {
        try {
            let countries = await getCountriesByFilter(countryValue, filterCountry);
            console.log(countries);
            let countriesUi = drawCountries(countries);
            RESULTS.html(countriesUi);
        } catch (e) {
            console.log(e);
            RESULTS.html(errorMessage());
        }
    } else {
        RESULTS.html(errorMessage());
    }
}

async function allCountries() {
    try {
        let countries = await getAllCountries();
        console.log(countries);
        let countriesUi = drawCountries(countries);
        RESULTS.html(countriesUi);
    } catch (e) {
        console.log(e);
        RESULTS.html(errorMessage());
    }
}

function getCountriesByFilter(countryValue, filterCountry) {
    return $.ajax({
        type: "GET",
        url: `https://restcountries.eu/rest/v2/${filterCountry}/${countryValue}`,
        dataType: "JSON",
        success: function (response) {
            return response;
        }
    });
}

function getAllCountries() {
    return $.ajax({
        type: "GET",
        url: "https://restcountries.eu/rest/v2/all",
        dataType: "JSON",
        success: function (response) {
            return response;
        }
    });
}

function drawCountries(countries) {
    let output = "";

    for (let country of countries) {
        let topLevelDomain = "";
        let currencies = "";

        for (let domain of country.topLevelDomain) {
            topLevelDomain += domain;
        }

        for (let currency of country.currencies) {
            currencies += `Code: ${currency.code}, Name: ${currency.name} Symbol: ${currency.symbol}<br>`;
        }
        output += 
        `<div class="col-lg-4">
            <div class="card">
                <img class="card-img-top" src="${country.flag}" alt="${country.name}">
                <div class="card-body">
                    <h3 class="card-title">${country.name}</h3>
                    <h5>Capital: ${country.capital}</h5>
                    <p class="card-text">Top Level Domain: ${topLevelDomain}</p>
                    <p>Currencies:<br>${currencies}</p>
                </div>
            </div>
        </div>`;
    }
    return output;
}

function errorMessage() {
    return `<div class="col-lg-12">
        <h1 class="alert alert-danger text-center">No Results</h1>
    </div>`;
}