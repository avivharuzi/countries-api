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
        let languages = "";
        let currencies = "";
        let timezones = "";

        for (let language of country.languages) {
            languages += `${language.name}<br>`;
        }

        for (let currency of country.currencies) {
            currencies += `${currency.code} ${currency.name} ${currency.symbol}<br>`;
        }

        for (let timezone of country.timezones) {
            timezones += `${timezone}<br>`;
        }

        output += 
        `<div class="col-lg-4 mb-5">
            <div class="card">
                <img class="card-img-top" src="${country.flag}" alt="${country.name}">
                <div class="card-header text-center">
                    <h3 class="card-title">${country.name}</h3>
                    <h5 class="card-subtitle text-muted">${country.capital}</h5>
                </div>
                <div class="card-body">
                    <table class="table text-center">
                        <tr>
                            <td>Population</td>
                            <td class="text-muted">${country.population} People</td>
                        </tr>
                        <tr>
                            <td>Region</td>
                            <td class="text-muted">${country.region}</td>
                        </tr>
                        <tr>
                            <td>Languages</td>
                            <td class="text-muted">${languages}</td>
                        </tr>
                        <tr>
                            <td>Currencies</td>
                            <td class="text-muted">${currencies}</td>
                        </tr>
                        <tr>
                            <td>Timezones</td>
                            <td class="text-muted">${timezones}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>`;
    }
    return output;
}

function errorMessage() {
    return `<div class="col-lg-12">
        <h4 class="alert alert-danger text-center lead"><i class="fa fa-exclamation-circle mr-2"></i>No Results</h4>
    </div>`;
}
