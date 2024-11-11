import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import { publicRouter } from "@/routes/routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function App() {
  return (
    <Router>
      <div className="admin-app">
        <Routes>
          {publicRouter.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}
