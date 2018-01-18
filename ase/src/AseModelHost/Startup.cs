using AseModelHost.Models;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AseModelHost {
  public class Startup {
    public Startup( IConfiguration configuration ) {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices( IServiceCollection services ) {
      services.AddMvc();
      services.AddCors();
      services.AddSingleton<IModelStorage>( new ModelStorage( Configuration) );
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure( IApplicationBuilder app, IHostingEnvironment env ) {
      if ( env.IsDevelopment() ) {
        app.UseDeveloperExceptionPage();
      }

      app.UseCors( builder => builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
      );

      app.UseMvc();
    }
  }
}
