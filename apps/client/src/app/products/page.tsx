import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; sort: string; search: string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;
  return (
    <div className="">
      <ProductList
        sort={sort}
        search={search}
        category={category}
        params="products"
      />
    </div>
  );
};

export default ProductsPage;
