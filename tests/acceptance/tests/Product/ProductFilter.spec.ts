import { test } from '@fixtures/AcceptanceTest';
import { PropertyGroup } from '@shopware-ag/acceptance-test-suite';

test('Customer should see unavailable filter disabled based on selected filter', async ({ ShopCustomer, TestDataService, StorefrontHome }) => {

    await TestDataService.setSystemConfig({ 'core.listing.disableEmptyFilterOptions': true });
    const color = await TestDataService.createColorPropertyGroup();
    const size = await TestDataService.createTextPropertyGroup();
    const propertyGroupsColor: PropertyGroup[] = [];
    const propertyGroupsText: PropertyGroup[] = [];
    propertyGroupsColor.push(color);
    propertyGroupsText.push(size);
    const sizeOption = await TestDataService.getPropertyGroupOptions(size.id);
    const colorManufacturer = await TestDataService.createBasicManufacturer({ name: 'Color Manufacturer', description: 'Color Description Manufacturer'});
    const parentProductColor = await TestDataService.createBasicProduct({manufacturerId: colorManufacturer.id});
    const sizeManufacturer = await TestDataService.createBasicManufacturer({name: 'Size Manufacturer', description: 'Size Description Manufacturer'});
    const parentProductSize = await TestDataService.createBasicProduct({manufacturerId: sizeManufacturer.id});
    const variantProductColor =  await TestDataService.createVariantProducts(parentProductColor, propertyGroupsColor, {description: 'Variant description'});
    const variantProductSize = await TestDataService.createVariantProducts(parentProductSize, propertyGroupsText, {description: 'Variant description'});
    const freeShipManufacturer = await TestDataService.createBasicManufacturer({name: 'Free-shipping Manufacturer', description: 'Free ship Description Manufacturer'});
    await TestDataService.createBasicProduct({ shippingFree: true, manufacturerId: freeShipManufacturer.id });
    // await TestDataService.createBasicProduct({ ratingAverage: 4 });

    await test.step('Select a manufacturer and verify that unavailable filter is disabled and products are filtered', async () => {
        await ShopCustomer.goesTo(StorefrontHome.url());
        await StorefrontHome.manufacturerFilter.click();
        const manufacturerLocators = await StorefrontHome.getManufacturerFilterItemByManufacturerName(colorManufacturer.name);
        await manufacturerLocators.click();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(size.name)).toBeDisabled();
        await ShopCustomer.expects(StorefrontHome.freeShippingFilter).toBeDisabled();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.priceFilterButton).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(1);
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveText(new RegExp(variantProductColor.map(product => product.name).join('|')));
    });

    await test.step('Reset all filters and verify that all filters are enabled', async () => {
        await StorefrontHome.resetAllButton.click();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(size.name)).toBeEnabled();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.manufacturerFilter).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.freeShippingFilter).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.priceFilterButton).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(3);
    });

    await test.step('Select another manufacturer and verify that a different filter is disabled', async () => {
        await StorefrontHome.manufacturerFilter.click();
        const manufacturerLocators = await StorefrontHome.getManufacturerFilterItemByManufacturerName(sizeManufacturer.name);
        await manufacturerLocators.click();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeDisabled();
        await ShopCustomer.expects(StorefrontHome.freeShippingFilter).toBeDisabled();
        await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(size.name)).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.priceFilterButton).toBeEnabled();
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(1);
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveText(new RegExp(variantProductSize.map(product => product.name).join('|')));
    });

    await test.step('Filter only by size and verify color and manufacturer filters are disabled', async () => {
        await StorefrontHome.resetAllButton.click();
        const sizeFilter = await StorefrontHome.getPropertyFilterByFilterName(size.name);
        const colorFilter = await StorefrontHome.getPropertyFilterByFilterName(color.name);
        await ShopCustomer.expects(sizeFilter).toBeEnabled();
        await ShopCustomer.expects(colorFilter).toBeEnabled();
        await (sizeFilter).click();
        // const sizeLocators = await StorefrontHome.getPropertyFilterByFilterName(StorefrontHome.propertyFilters, sizeOption.at(0).name);
        // await sizeLocators.itemCheckbox.click();
        // await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeDisabled();
        //
        // await StorefrontHome.manufacturerFilter.click();
        // const manufacturerLocators = await StorefrontHome.getFilterItemByItemName(StorefrontHome.manufacturerFilter, colorManufacturer.name);
        // await ShopCustomer.expects(manufacturerLocators.item).toHaveAttribute('title', 'This filter does not display any further results in combination with the selected filters.');
        // await ShopCustomer.expects(manufacturerLocators.itemCheckbox).toBeDisabled();
    });
    //
    // await test.step('Close manufacturer filter and select filter by free shipping, verify that all filters are disabled', async () => {
    //     await StorefrontHome.manufacturerFilter.click();
    //     await StorefrontHome.filerResetAllButton.click();
    //     await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(size.name)).toBeEnabled();
    //     await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeEnabled();
    //     await StorefrontHome.freeShippingFilter.click();
    //     await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(size.name)).toBeDisabled();
    //     await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(color.name)).toBeDisabled();
    // });
    //
    // await test.step('Select filter by rating, verify that all filters are disabled', async () => {
    //
    //     // await (await StorefrontHome.getManufacturerFilterItemByManufacturerName(manufacturer2.name)).click();
    //     // await ShopCustomer.expects(await StorefrontHome.getPropertyFilterByFilterName(propertyGroupColor.name)).toBeDisabled();
    // });

});

// test('Should disable some filters if filtered by size', async ({ ShopCustomer }) => {

// });
//
// test('Should disable free shipping filter', async ({ ShopCustomer }) => {

// });
//
// test('Should filter by rating and disable not possible rating filter options', async ({ ShopCustomer }) => {

// });
