
 (async () => {

    const productDivs = document.querySelectorAll('.contentlist_sec .allActiveProd');
    const productIds = Array.from(productDivs).map(div => div.id.replace('pro_', ''));
    console.log("Found product IDs:", productIds);
  
    for (const productId of productIds) {
      console.log(`Starting processing for product: ${productId}`);
  
      try {
        await getSubProduct(productId, '0', '1', 'true');
        console.log(`getSubProduct completed for ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
  
        await pre_mark_as_complete(productId, 'false');
        console.log(`pre_mark_as_complete executed for ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
  
        await mark_as_complete_hub_product(productId);
        console.log(`mark_as_complete_hub_product finished for ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
  
        
      }catch (error) {
        console.error(`Error processing ${productId}:`, error);
      }
    }
  
    console.log("Task Completed!");
  })();