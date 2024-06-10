import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { searchData } from "../services/search";
import { Data } from "../types";

const DEBOUNCE_TIME = 300;

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.href);
    return searchParams.get("q") ?? "";
  });

  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {
    const newPathname =
      search === "" ? window.location.pathname : `?q=${debouncedSearch}`;

    window.history.replaceState({}, "", newPathname);
  }, [debouncedSearch]);

  useEffect(() => {
    // api call to fetch query results
    if (debouncedSearch === "") {
      setData(initialData);
      return;
    }
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response;
      if (err) {
        toast.error(`${err.message}`);
        return;
      }

      if (newData) {
        setData(newData);
        toast.success("Datos encontrados!");
        return;
      }
    });
  }, [debouncedSearch, initialData]);

  return (
    <>
      <h1>Search</h1>
      <form onChange={handleSearch}>
        <input placeholder="Search" type="search" />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id} id={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong>: {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </>
  );
};
